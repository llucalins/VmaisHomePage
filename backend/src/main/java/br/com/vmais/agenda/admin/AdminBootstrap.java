package br.com.vmais.agenda.admin;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminBootstrap implements CommandLineRunner {
  private final AdminUserRepository admins;
  private final PasswordEncoder passwordEncoder;
  private final String email;
  private final String password;
  private final String name;

  public AdminBootstrap(
      AdminUserRepository admins,
      PasswordEncoder passwordEncoder,
      @Value("${app.bootstrap.admin-email}") String email,
      @Value("${app.bootstrap.admin-password}") String password,
      @Value("${app.bootstrap.admin-name}") String name) {
    this.admins = admins;
    this.passwordEncoder = passwordEncoder;
    this.email = email;
    this.password = password;
    this.name = name;
  }

  @Override
  public void run(String... args) {
    if (admins.count() > 0) {
      return;
    }

    AdminUser admin = new AdminUser();
    admin.setEmail(email.toLowerCase());
    admin.setDisplayName(name);
    admin.setPasswordHash(passwordEncoder.encode(password));
    admins.save(admin);
  }
}
