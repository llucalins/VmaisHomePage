package br.com.vmais.agenda.config;

import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AppProperties {
  private final List<String> allowedOrigins;
  private final String jwtSecret;
  private final long jwtExpirationMinutes;

  public AppProperties(
      @Value("${app.cors.allowed-origins}") String allowedOrigins,
      @Value("${app.security.jwt-secret}") String jwtSecret,
      @Value("${app.security.jwt-expiration-minutes}") long jwtExpirationMinutes) {
    this.allowedOrigins = Arrays.stream(allowedOrigins.split(","))
        .map(String::trim)
        .filter(origin -> !origin.isBlank())
        .toList();
    this.jwtSecret = jwtSecret;
    this.jwtExpirationMinutes = jwtExpirationMinutes;
  }

  public List<String> getAllowedOrigins() {
    return allowedOrigins;
  }

  public String getJwtSecret() {
    return jwtSecret;
  }

  public long getJwtExpirationMinutes() {
    return jwtExpirationMinutes;
  }
}
