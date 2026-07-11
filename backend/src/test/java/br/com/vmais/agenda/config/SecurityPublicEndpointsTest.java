package br.com.vmais.agenda.config;

import br.com.vmais.agenda.admin.AdminUserRepository;
import br.com.vmais.agenda.auth.AuthController;
import br.com.vmais.agenda.contact.ContactMessageController;
import br.com.vmais.agenda.contact.ContactMessageRepository;
import br.com.vmais.agenda.contact.ContactNotificationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {AuthController.class, ContactMessageController.class})
@Import({
    AppProperties.class,
    ApiExceptionHandler.class,
    JwtAuthenticationFilter.class,
    SecurityConfig.class
})
@TestPropertySource(properties = {
    "app.cors.allowed-origins=http://localhost:5173",
    "app.security.jwt-secret=vmais-test-secret-change-this-value-with-at-least-32-chars",
    "app.security.jwt-expiration-minutes=480"
})
class SecurityPublicEndpointsTest {
  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private AdminUserRepository admins;

  @MockBean
  private JwtService jwtService;

  @MockBean
  private ContactMessageRepository contactMessages;

  @MockBean
  private ContactNotificationService notificationService;

  @Test
  void loginWithInvalidCredentialsReachesController() throws Exception {
    mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {"email":"admin@example.com","password":"wrong"}
                """))
        .andExpect(status().isUnauthorized())
        .andExpect(content().string(containsString("Credenciais invalidas")));
  }

  @Test
  void emptyContactMessageReachesValidation() throws Exception {
    mockMvc.perform(post("/api/contact-messages")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{}"))
        .andExpect(status().isBadRequest())
        .andExpect(content().string(containsString("privacyAccepted")));
  }

  @Test
  void protectedRouteStillRequiresAuthentication() throws Exception {
    mockMvc.perform(get("/api/auth/me"))
        .andExpect(status().isUnauthorized());
  }
}
