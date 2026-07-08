package br.com.vmais.agenda.reminder;

import br.com.vmais.agenda.event.AgendaItem;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "reminder_dispatches")
public class ReminderDispatch {
  @Id
  @GeneratedValue
  private UUID id;

  @Column(name = "dispatch_key", nullable = false, unique = true, length = 220)
  private String dispatchKey;

  @Column(name = "dispatch_type", nullable = false, length = 60)
  private String dispatchType;

  @ManyToOne
  @JoinColumn(name = "agenda_item_id")
  private AgendaItem agendaItem;

  @Column(name = "scheduled_at", nullable = false)
  private LocalDateTime scheduledAt;

  @Column(name = "whatsapp_group_name", length = 140)
  private String whatsappGroupName;

  @Column(nullable = false, columnDefinition = "text")
  private String message;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(nullable = false, columnDefinition = "jsonb")
  private String payload;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 40)
  private ReminderDispatchStatus status = ReminderDispatchStatus.PENDING;

  @Column(name = "sent_at")
  private LocalDateTime sentAt;

  @Column(name = "failed_at")
  private LocalDateTime failedAt;

  @Column(name = "error_message", columnDefinition = "text")
  private String errorMessage;

  @Column(nullable = false)
  private int attempts = 0;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  @PrePersist
  void onCreate() {
    Instant now = Instant.now();
    if (createdAt == null) {
      createdAt = now;
    }
    updatedAt = now;
  }

  @PreUpdate
  void onUpdate() {
    updatedAt = Instant.now();
  }

  public UUID getId() {
    return id;
  }

  public String getDispatchKey() {
    return dispatchKey;
  }

  public void setDispatchKey(String dispatchKey) {
    this.dispatchKey = dispatchKey;
  }

  public String getDispatchType() {
    return dispatchType;
  }

  public void setDispatchType(String dispatchType) {
    this.dispatchType = dispatchType;
  }

  public AgendaItem getAgendaItem() {
    return agendaItem;
  }

  public void setAgendaItem(AgendaItem agendaItem) {
    this.agendaItem = agendaItem;
  }

  public LocalDateTime getScheduledAt() {
    return scheduledAt;
  }

  public void setScheduledAt(LocalDateTime scheduledAt) {
    this.scheduledAt = scheduledAt;
  }

  public String getWhatsappGroupName() {
    return whatsappGroupName;
  }

  public void setWhatsappGroupName(String whatsappGroupName) {
    this.whatsappGroupName = whatsappGroupName;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public String getPayload() {
    return payload;
  }

  public void setPayload(String payload) {
    this.payload = payload;
  }

  public ReminderDispatchStatus getStatus() {
    return status;
  }

  public void setStatus(ReminderDispatchStatus status) {
    this.status = status;
  }

  public LocalDateTime getSentAt() {
    return sentAt;
  }

  public void setSentAt(LocalDateTime sentAt) {
    this.sentAt = sentAt;
  }

  public LocalDateTime getFailedAt() {
    return failedAt;
  }

  public void setFailedAt(LocalDateTime failedAt) {
    this.failedAt = failedAt;
  }

  public String getErrorMessage() {
    return errorMessage;
  }

  public void setErrorMessage(String errorMessage) {
    this.errorMessage = errorMessage;
  }

  public int getAttempts() {
    return attempts;
  }

  public void setAttempts(int attempts) {
    this.attempts = attempts;
  }
}
