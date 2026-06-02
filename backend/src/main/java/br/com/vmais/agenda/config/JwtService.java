package br.com.vmais.agenda.config;

import br.com.vmais.agenda.admin.AdminUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
  private final AppProperties properties;
  private final SecretKey key;

  public JwtService(AppProperties properties) {
    this.properties = properties;
    this.key = Keys.hmacShaKeyFor(properties.getJwtSecret().getBytes(StandardCharsets.UTF_8));
  }

  public String generate(AdminUser admin) {
    Instant now = Instant.now();
    Instant expiresAt = now.plusSeconds(properties.getJwtExpirationMinutes() * 60);

    return Jwts.builder()
        .subject(admin.getEmail())
        .claim("adminId", admin.getId().toString())
        .claim("role", admin.getRole())
        .issuedAt(Date.from(now))
        .expiration(Date.from(expiresAt))
        .signWith(key)
        .compact();
  }

  public String subject(String token) {
    return claims(token).getSubject();
  }

  private Claims claims(String token) {
    return Jwts.parser()
        .verifyWith(key)
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }
}
