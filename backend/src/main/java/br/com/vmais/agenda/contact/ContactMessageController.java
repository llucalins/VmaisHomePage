package br.com.vmais.agenda.contact;

import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact-messages")
public class ContactMessageController {
  private final ContactMessageRepository contactMessages;
  private final ContactNotificationService notificationService;

  public ContactMessageController(
      ContactMessageRepository contactMessages,
      ContactNotificationService notificationService) {
    this.contactMessages = contactMessages;
    this.notificationService = notificationService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public ContactMessageResponse create(@Valid @RequestBody ContactMessageRequest request) {
    ContactMessage contactMessage = new ContactMessage();
    contactMessage.setName(request.name().trim());
    contactMessage.setEmail(request.email().trim().toLowerCase());
    contactMessage.setCompany(blankToNull(request.company()));
    contactMessage.setService(blankToNull(request.service()));
    contactMessage.setMessage(request.message().trim());
    contactMessage.setPrivacyAcceptedAt(Instant.now());

    ContactMessage saved = contactMessages.save(contactMessage);
    notificationService.notify(saved);
    return ContactMessageResponse.from(saved);
  }

  private String blankToNull(String value) {
    return value == null || value.isBlank() ? null : value.trim();
  }

  public record ContactMessageRequest(
      @NotBlank @Size(max = 140) String name,
      @NotBlank @Email @Size(max = 180) String email,
      @Size(max = 160) String company,
      @Size(max = 160) String service,
      @NotBlank @Size(max = 4000) String message,
      @NotNull @AssertTrue Boolean privacyAccepted) {
  }

  public record ContactMessageResponse(UUID id, Instant createdAt) {
    static ContactMessageResponse from(ContactMessage contactMessage) {
      return new ContactMessageResponse(contactMessage.getId(), contactMessage.getCreatedAt());
    }
  }
}
