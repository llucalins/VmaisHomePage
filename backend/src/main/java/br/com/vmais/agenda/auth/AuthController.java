package br.com.vmais.agenda.auth;

import br.com.vmais.agenda.admin.AdminUser;
import br.com.vmais.agenda.admin.AdminUserRepository;
import br.com.vmais.agenda.config.JwtService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final AdminUserRepository admins;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthController(
      AdminUserRepository admins,
      PasswordEncoder passwordEncoder,
      JwtService jwtService) {
    this.admins = admins;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  @PostMapping("/login")
  public LoginResponse login(@Valid @RequestBody LoginRequest request) {
    AdminUser admin = admins.findByEmailIgnoreCase(request.email())
        .filter(AdminUser::isActive)
        .filter(user -> passwordEncoder.matches(request.password(), user.getPasswordHash()))
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais invalidas"));

    JwtService.GeneratedToken token = jwtService.generate(admin);
    return new LoginResponse(token.token(), token.expiresAt(), AdminResponse.from(admin));
  }

  @GetMapping("/me")
  public AdminResponse me(@AuthenticationPrincipal AdminUser admin) {
    return AdminResponse.from(admin);
  }

  public record LoginRequest(
      @Email @NotBlank String email,
      @NotBlank String password) {
  }

  public record LoginResponse(String token, Instant expiresAt, AdminResponse admin) {
  }

  public record AdminResponse(UUID id, String email, String displayName, String role) {
    static AdminResponse from(AdminUser admin) {
      return new AdminResponse(admin.getId(), admin.getEmail(), admin.getDisplayName(), admin.getRole());
    }
  }
}
