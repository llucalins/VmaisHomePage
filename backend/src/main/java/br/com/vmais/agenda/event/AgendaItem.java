package br.com.vmais.agenda.event;

import br.com.vmais.agenda.admin.AdminUser;
import br.com.vmais.agenda.employee.Employee;
import br.com.vmais.agenda.sector.Sector;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "agenda_items")
public class AgendaItem {
  @Id
  @GeneratedValue
  private UUID id;

  @Column(nullable = false, length = 180)
  private String title;

  @Column(columnDefinition = "text")
  private String description;

  @Column(name = "event_date", nullable = false)
  private LocalDate eventDate;

  @Column(name = "start_time")
  private LocalTime startTime;

  @Column(name = "end_time")
  private LocalTime endTime;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 40)
  private AgendaStatus status = AgendaStatus.TODO;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 40)
  private Priority priority = Priority.NORMAL;

  @Column(name = "whatsapp_group_name", length = 140)
  private String whatsappGroupName;

  @Column(name = "reminder_minutes_before", nullable = false)
  private int reminderMinutesBefore = 60;

  @ManyToOne
  @JoinColumn(name = "sector_id")
  private Sector sector;

  @ManyToOne
  @JoinColumn(name = "responsible_id")
  private Employee responsible;

  @OneToMany(mappedBy = "agendaItem", cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true)
  private List<AgendaAssignment> assignments = new ArrayList<>();

  @ManyToOne(optional = false)
  @JoinColumn(name = "created_by_id")
  private AdminUser createdBy;

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

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public LocalDate getEventDate() {
    return eventDate;
  }

  public void setEventDate(LocalDate eventDate) {
    this.eventDate = eventDate;
  }

  public LocalTime getStartTime() {
    return startTime;
  }

  public void setStartTime(LocalTime startTime) {
    this.startTime = startTime;
  }

  public LocalTime getEndTime() {
    return endTime;
  }

  public void setEndTime(LocalTime endTime) {
    this.endTime = endTime;
  }

  public AgendaStatus getStatus() {
    return status;
  }

  public void setStatus(AgendaStatus status) {
    this.status = status;
  }

  public Priority getPriority() {
    return priority;
  }

  public void setPriority(Priority priority) {
    this.priority = priority;
  }

  public String getWhatsappGroupName() {
    return whatsappGroupName;
  }

  public void setWhatsappGroupName(String whatsappGroupName) {
    this.whatsappGroupName = whatsappGroupName;
  }

  public int getReminderMinutesBefore() {
    return reminderMinutesBefore;
  }

  public void setReminderMinutesBefore(int reminderMinutesBefore) {
    this.reminderMinutesBefore = reminderMinutesBefore;
  }

  public Sector getSector() {
    return sector;
  }

  public void setSector(Sector sector) {
    this.sector = sector;
  }

  public Employee getResponsible() {
    return responsible;
  }

  public void setResponsible(Employee responsible) {
    this.responsible = responsible;
  }

  public List<AgendaAssignment> getAssignments() {
    return assignments;
  }

  public void setAssignments(List<AgendaAssignment> assignments) {
    this.assignments = assignments;
  }

  public AdminUser getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(AdminUser createdBy) {
    this.createdBy = createdBy;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }
}
