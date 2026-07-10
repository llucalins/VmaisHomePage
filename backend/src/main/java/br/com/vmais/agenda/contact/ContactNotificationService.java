package br.com.vmais.agenda.contact;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ContactNotificationService {
  private static final Logger logger = LoggerFactory.getLogger(ContactNotificationService.class);

  private final ObjectProvider<JavaMailSender> mailSenderProvider;
  private final boolean mailEnabled;
  private final String recipient;
  private final String from;

  public ContactNotificationService(
      ObjectProvider<JavaMailSender> mailSenderProvider,
      @Value("${app.contact.mail-enabled:false}") boolean mailEnabled,
      @Value("${app.contact.recipient-email:agenciavmaiscomunicacao@gmail.com}") String recipient,
      @Value("${app.contact.from-email:no-reply@vmais.local}") String from) {
    this.mailSenderProvider = mailSenderProvider;
    this.mailEnabled = mailEnabled;
    this.recipient = recipient;
    this.from = from;
  }

  public void notify(ContactMessage contactMessage) {
    if (!mailEnabled) {
      logger.info("Mensagem de contato salva sem envio de email. id={}", contactMessage.getId());
      return;
    }

    JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
    if (mailSender == null) {
      logger.warn("Envio de email habilitado, mas JavaMailSender nao esta configurado.");
      return;
    }

    try {
      SimpleMailMessage message = new SimpleMailMessage();
      message.setTo(recipient);
      message.setFrom(from);
      message.setReplyTo(contactMessage.getEmail());
      message.setSubject("Novo contato pelo site - " + contactMessage.getName());
      message.setText(body(contactMessage));
      mailSender.send(message);
    } catch (RuntimeException exception) {
      logger.warn("Nao foi possivel enviar email da mensagem de contato id={}", contactMessage.getId(), exception);
    }
  }

  private String body(ContactMessage contactMessage) {
    return """
        Novo contato recebido pelo site.

        Nome: %s
        Email: %s
        Empresa: %s
        Servico de interesse: %s

        Mensagem:
        %s
        """.formatted(
        contactMessage.getName(),
        contactMessage.getEmail(),
        valueOrDefault(contactMessage.getCompany()),
        valueOrDefault(contactMessage.getService()),
        contactMessage.getMessage());
  }

  private String valueOrDefault(String value) {
    return value == null || value.isBlank() ? "Nao informado" : value;
  }
}
