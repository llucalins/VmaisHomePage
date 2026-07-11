import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import P from "pino";
import qrcode from "qrcode-terminal";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnvFile(path) {
  try {
    const content = readFileSync(path, "utf8");
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#") || !line.includes("=")) continue;
      const [key, ...valueParts] = line.split("=");
      const value = valueParts.join("=").trim().replace(/^['"]|['"]$/g, "");
      process.env[key.trim()] ??= value;
    }
  } catch {
    // Local env file is optional.
  }
}

function argValue(name, fallback = null) {
  const prefix = `${name}=`;
  const inline = process.argv.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function hasArg(name) {
  return process.argv.includes(name);
}

function configFromEnv() {
  loadEnvFile(resolve(__dirname, ".env"));
  const authDir = process.env.VMAIS_BAILEYS_AUTH_DIR
    ? resolve(__dirname, process.env.VMAIS_BAILEYS_AUTH_DIR)
    : resolve(__dirname, "auth");
  return {
    apiUrl: process.env.VMAIS_API_URL || "http://localhost:8080/api",
    email: process.env.VMAIS_ADMIN_EMAIL || "admin@vmais.local",
    password: process.env.VMAIS_ADMIN_PASSWORD || "admin123",
    defaultGroupName: process.env.VMAIS_WHATSAPP_GROUP_NAME || "",
    authDir,
    days: Number(argValue("--days", process.env.VMAIS_BOT_DAYS || "7")),
    lookaheadMinutes: Number(argValue("--lookahead-minutes", process.env.VMAIS_BOT_LOOKAHEAD_MINUTES || "0")),
    intervalSeconds: Number(argValue("--interval-seconds", process.env.VMAIS_BOT_INTERVAL_SECONDS || "300")),
  };
}

class ApiClient {
  constructor(config) {
    this.config = config;
    this.token = null;
  }

  async login() {
    const response = await this.request("/auth/login", {
      method: "POST",
      body: {
        email: this.config.email,
        password: this.config.password,
      },
      authenticated: false,
    });
    this.token = response.token;
  }

  async get(path, params = null) {
    return this.request(this.withQuery(path, params));
  }

  async post(path, params = null, body = null) {
    return this.request(this.withQuery(path, params), {
      method: "POST",
      body,
    });
  }

  async patch(path, body = null) {
    return this.request(path, {
      method: "PATCH",
      body,
    });
  }

  withQuery(path, params) {
    if (!params) return path;
    return `${path}?${new URLSearchParams(params)}`;
  }

  async request(path, options = {}) {
    const method = options.method || "GET";
    const authenticated = options.authenticated ?? true;
    const headers = { "Content-Type": "application/json" };
    if (authenticated) {
      if (!this.token) throw new Error("Token ausente. Execute login antes de chamar a API.");
      headers.Authorization = `Bearer ${this.token}`;
    }

    const url = `${this.config.apiUrl.replace(/\/$/, "")}${path}`;
    let response;
    try {
      response = await fetch(url, {
        method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
    } catch (error) {
      const detail = error.cause?.errors?.map((item) => `${item.code} ${item.address}:${item.port}`).join(", ")
        || error.cause?.message
        || error.message;
      throw new Error(`Nao foi possivel conectar na API em ${url}: ${detail}`);
    }
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    if (!response.ok) {
      throw new Error(`API respondeu ${response.status} em ${path}: ${text}`);
    }
    return data;
  }
}

function nowIso() {
  return localIso(new Date());
}

function todayIso() {
  return localIso(new Date()).slice(0, 10);
}

function localIso(date) {
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 19);
}

function pendingDueUntil(config) {
  return localIso(new Date(Date.now() + config.lookaheadMinutes * 60_000));
}

function phoneToJid(phoneNumber) {
  const digits = String(phoneNumber || "").replace(/\D/g, "");
  if (!digits) return null;
  const withCountry = digits.startsWith("55") ? digits : `55${digits}`;
  return `${withCountry}@s.whatsapp.net`;
}

function parsePayload(dispatch) {
  const rawPayload = dispatch.payload || {};
  return typeof rawPayload === "string" ? JSON.parse(rawPayload) : rawPayload;
}

function mentionsFromPayload(payload) {
  const mentions = payload.dispatch?.mentions || payload.dispatches?.[0]?.mentions || [];
  return mentions.map((mention) => phoneToJid(mention.phoneNumber)).filter(Boolean);
}

function messageText(dispatch, payload) {
  const mentions = payload.dispatch?.mentions || payload.dispatches?.[0]?.mentions || [];
  const mentionLine = mentions
    .map((mention) => {
      const jid = phoneToJid(mention.phoneNumber);
      return jid ? `@${jid.split("@")[0]}` : mention.name;
    })
    .filter(Boolean)
    .join(" ");

  return mentionLine ? `${dispatch.message}\n\nEscalados: ${mentionLine}` : dispatch.message;
}

async function connectWhatsApp(config) {
  mkdirSync(config.authDir, { recursive: true });
  const { state, saveCreds } = await useMultiFileAuthState(config.authDir);
  const sock = makeWASocket({
    auth: state,
    logger: P({ level: "silent" }),
    browser: ["Vmais Agenda", "Chrome", "1.0.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  return new Promise((resolveSocket, rejectSocket) => {
    const timeout = setTimeout(() => {
      rejectSocket(new Error("Tempo esgotado aguardando conexao com WhatsApp."));
    }, 120_000);

    sock.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect, qr } = update;
      if (qr) {
        console.log("Leia o QR Code abaixo com o WhatsApp do numero do bot:");
        qrcode.generate(qr, { small: true });
      }
      if (connection === "open") {
        clearTimeout(timeout);
        resolveSocket(sock);
      }
      if (connection === "close") {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        if (statusCode === DisconnectReason.loggedOut) {
          rejectSocket(new Error("Sessao desconectada. Apague bot/auth e leia o QR Code novamente."));
        }
      }
    });
  });
}

async function groupMap(sock) {
  const groups = await sock.groupFetchAllParticipating();
  return Object.values(groups).reduce((acc, group) => {
    acc.set(group.subject.toLowerCase(), group.id);
    return acc;
  }, new Map());
}

async function listGroups(sock) {
  const groups = await sock.groupFetchAllParticipating();
  const sortedGroups = Object.values(groups).sort((a, b) => a.subject.localeCompare(b.subject));
  for (const group of sortedGroups) {
    console.log(`${group.subject} | ${group.id}`);
  }
}

async function sendDispatch(sock, groups, config, dispatch) {
  const payload = parsePayload(dispatch);
  const groupName = dispatch.whatsappGroupName || config.defaultGroupName;
  if (!groupName) {
    throw new Error(`Disparo ${dispatch.id} sem grupo configurado.`);
  }
  const groupJid = groups.get(groupName.toLowerCase());
  if (!groupJid) {
    throw new Error(`Grupo "${groupName}" nao encontrado na conta conectada.`);
  }

  await sock.sendMessage(groupJid, {
    text: messageText(dispatch, payload),
    mentions: mentionsFromPayload(payload),
  });
}

async function runCycle({ api, sock, groups, config, send }) {
  await api.login();
  await api.post("/reminders/dispatches/materialize", {
    from: todayIso(),
    days: String(config.days),
  });
  const pending = await api.get("/reminders/dispatches/pending", {
    dueUntil: pendingDueUntil(config),
  });

  console.log(`[${nowIso()}] Disparos pendentes: ${pending.length}`);
  for (const dispatch of pending) {
    try {
      if (send) {
        await sendDispatch(sock, groups, config, dispatch);
        await api.patch(`/reminders/dispatches/${dispatch.id}/sent`, {
          at: nowIso(),
          message: "Enviado via Baileys.",
        });
        console.log(`Enviado: ${dispatch.dispatchKey}`);
      } else {
        console.log(`[dry-run] ${dispatch.dispatchKey}`);
        console.log(dispatch.message);
      }
    } catch (error) {
      await api.patch(`/reminders/dispatches/${dispatch.id}/failed`, {
        at: nowIso(),
        message: error.message,
      });
      console.error(`Falha: ${dispatch.dispatchKey} | ${error.message}`);
    }
  }
}

async function main() {
  const config = configFromEnv();
  const shouldSend = hasArg("--send");
  const shouldLoop = hasArg("--loop");
  const shouldListGroups = hasArg("--list-groups");
  const api = new ApiClient(config);

  let sock = null;
  let groups = null;
  if (shouldSend || shouldListGroups) {
    sock = await connectWhatsApp(config);
    groups = await groupMap(sock);
  }

  if (shouldListGroups) {
    await listGroups(sock);
    return;
  }

  await runCycle({ api, sock, groups, config, send: shouldSend });
  if (!shouldLoop) return;

  setInterval(() => {
    runCycle({ api, sock, groups, config, send: shouldSend }).catch((error) => {
      console.error(`Erro no ciclo do worker: ${error.message}`);
    });
  }, config.intervalSeconds * 1000);
}

main().catch((error) => {
  console.error(`Erro: ${error.message}`);
  process.exit(1);
});
