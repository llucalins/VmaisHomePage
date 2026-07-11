package br.com.vmais.agenda.config;

import java.util.Arrays;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ProductionSecurityGuard implements CommandLineRunner {
  private static final String DEFAULT_ADMIN_EMAIL = "admin@vmais.local";
  private static final String DEFAULT_ADMIN_PASSWORD = "admin123";
  private static final String DEFAULT_JWT_SECRET =
      "vmais-local-development-secret-change-this-value-with-at-least-32-chars";

  private final Environment environment;
  private final String adminEmail;
  private final String adminPassword;
  private final String jwtSecret;

  public ProductionSecurityGuard(
      Environment environment,
      @Value("${app.bootstrap.admin-email}") String adminEmail,
      @Value("${app.bootstrap.admin-password}") String adminPassword,
      @Value("${app.security.jwt-secret}") String jwtSecret) {
    this.environment = environment;
    this.adminEmail = adminEmail;
    this.adminPassword = adminPassword;
    this.jwtSecret = jwtSecret;
  }

  @Override
  public void run(String... args) {
    if (!isProduction()) {
      return;
    }

    if (DEFAULT_ADMIN_EMAIL.equalsIgnoreCase(adminEmail)
        || DEFAULT_ADMIN_PASSWORD.equals(adminPassword)
        || DEFAULT_JWT_SECRET.equals(jwtSecret)) {
      throw new IllegalStateException(
          "Production requires secure VMAIS_ADMIN_EMAIL, VMAIS_ADMIN_PASSWORD and JWT_SECRET values.");
    }
  }

  private boolean isProduction() {
    return Arrays.stream(environment.getActiveProfiles())
        .anyMatch(profile -> profile.equalsIgnoreCase("prod") || profile.equalsIgnoreCase("production"));
  }
}
