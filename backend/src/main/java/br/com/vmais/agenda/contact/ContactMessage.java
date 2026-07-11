package br.com.vmais.agenda.contact;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "contact_messages")
public class ContactMessage {
  @Id
  @GeneratedValue
  private UUID id;

  @Column(nullable = false, length = 140)
  private String name;

  @Column(nullable = false, length = 180)
  private String email;

  @Column(length = 160)
  private String company;

  @Column(length = 160)
  private String service;

  @Column(nullable = false, columnDefinition = "text")
  private String message;

  @Column(name = "privacy_accepted_at", nullable = false)
  private Instant privacyAcceptedAt;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @PrePersist
  void onCreate() {
    if (createdAt == null) {
      createdAt = Instant.now();
    }
  }

  public UUID getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getCompany() {
    return company;
  }

  public void setCompany(String company) {
    this.company = company;
  }

  public String getService() {
    return service;
  }

  public void setService(String service) {
    this.service = service;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public Instant getPrivacyAcceptedAt() {
    return privacyAcceptedAt;
  }

  public void setPrivacyAcceptedAt(Instant privacyAcceptedAt) {
    this.privacyAcceptedAt = privacyAcceptedAt;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
