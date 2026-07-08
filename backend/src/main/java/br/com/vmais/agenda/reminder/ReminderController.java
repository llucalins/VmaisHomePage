package br.com.vmais.agenda.reminder;

import br.com.vmais.agenda.event.AgendaItem;
import br.com.vmais.agenda.event.AgendaItemRepository;
import br.com.vmais.agenda.event.AgendaStatus;
import br.com.vmais.agenda.event.WorkType;
import br.com.vmais.agenda.employee.Employee;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.time.temporal.TemporalAdjusters;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {
  private static final LocalTime WEEKLY_DIGEST_TIME = LocalTime.of(8, 0);
  private static final LocalTime EARLY_EVENT_LIMIT = LocalTime.of(9, 0);
  private static final LocalTime PREVIOUS_NIGHT_DISPATCH_TIME = LocalTime.of(20, 0);

  private final AgendaItemRepository agendaItems;
  private final ReminderDispatchRepository dispatches;
  private final ObjectMapper objectMapper;

  public ReminderController(
      AgendaItemRepository agendaItems,
      ReminderDispatchRepository dispatches,
      ObjectMapper objectMapper) {
    this.agendaItems = agendaItems;
    this.dispatches = dispatches;
    this.objectMapper = objectMapper;
  }

  @GetMapping("/preview")
  public List<ReminderPreview> preview() {
    LocalDate today = LocalDate.now();
    LocalDate tomorrow = today.plusDays(1);

    return agendaItems.findByEventDateBetweenOrderByEventDateAscStartTimeAsc(today, tomorrow).stream()
        .filter(item -> item.getStatus() != AgendaStatus.DONE && item.getStatus() != AgendaStatus.CANCELED)
        .map(this::toPreview)
        .toList();
  }

  @GetMapping("/weekly-summary")
  public WeeklySummary weeklySummary(
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart) {
    LocalDate start = weekStart == null
        ? LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
        : weekStart.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
    LocalDate end = start.plusDays(6);
    List<BotReminderItem> items = agendaItems.findByEventDateBetweenOrderByEventDateAscStartTimeAsc(start, end).stream()
        .filter(item -> item.getWorkType() == WorkType.COVERAGE)
        .filter(item -> item.getStatus() != AgendaStatus.DONE && item.getStatus() != AgendaStatus.CANCELED)
        .map(this::toBotReminder)
        .toList();
    String whatsappGroupName = firstGroupName(items);
    BotDispatch dispatch = new BotDispatch(
        "WEEKLY_DIGEST",
        start.atTime(WEEKLY_DIGEST_TIME),
        0,
        whatsappGroupName,
        buildWeeklyMessage(start, end, items),
        mentionsForItems(items));

    return new WeeklySummary(start, end, dispatch, items);
  }

  @GetMapping("/upcoming")
  public List<BotReminderItem> upcoming(
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
      @RequestParam(defaultValue = "7") int days) {
    LocalDate start = from == null ? LocalDate.now() : from;
    LocalDate end = to == null ? start.plusDays(Math.max(1, days) - 1L) : to;

    return agendaItems.findByEventDateBetweenOrderByEventDateAscStartTimeAsc(start, end).stream()
        .filter(item -> item.getWorkType() == WorkType.COVERAGE)
        .filter(item -> item.getStatus() != AgendaStatus.DONE && item.getStatus() != AgendaStatus.CANCELED)
        .map(this::toBotReminder)
        .toList();
  }

  @PostMapping("/dispatches/materialize")
  public List<ReminderDispatchResponse> materialize(
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
      @RequestParam(defaultValue = "7") int days) {
    List<DispatchCandidate> candidates = new ArrayList<>();
    WeeklySummary summary = weeklySummary(from);
    candidates.add(new DispatchCandidate(
        weeklyDispatchKey(summary),
        null,
        summary.dispatch(),
        summary));
    upcoming(from, to, days).forEach(item -> item.dispatches().forEach(dispatch ->
        candidates.add(new DispatchCandidate(
            eventDispatchKey(item.agendaItemId(), dispatch),
            item.agendaItemId(),
            dispatch,
            item))));

    return candidates.stream()
        .map(this::materialize)
        .map(ReminderDispatchResponse::from)
        .toList();
  }

  @GetMapping("/dispatches/pending")
  public List<ReminderDispatchResponse> pendingDispatches(
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dueUntil) {
    LocalDateTime limit = dueUntil == null ? LocalDateTime.now() : dueUntil;
    return dispatches.findByStatusAndScheduledAtLessThanEqualOrderByScheduledAtAsc(
            ReminderDispatchStatus.PENDING,
            limit)
        .stream()
        .map(ReminderDispatchResponse::from)
        .toList();
  }

  @PatchMapping("/dispatches/{id}/sent")
  public ReminderDispatchResponse markSent(
      @PathVariable UUID id,
      @Valid @RequestBody(required = false) DispatchResultRequest request) {
    ReminderDispatch dispatch = dispatches.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Disparo nao encontrado"));
    dispatch.setStatus(ReminderDispatchStatus.SENT);
    dispatch.setSentAt(request != null && request.at() != null ? request.at() : LocalDateTime.now());
    dispatch.setFailedAt(null);
    dispatch.setErrorMessage(null);
    return ReminderDispatchResponse.from(dispatches.save(dispatch));
  }

  @PatchMapping("/dispatches/{id}/failed")
  public ReminderDispatchResponse markFailed(
      @PathVariable UUID id,
      @Valid @RequestBody(required = false) DispatchResultRequest request) {
    ReminderDispatch dispatch = dispatches.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Disparo nao encontrado"));
    dispatch.setStatus(ReminderDispatchStatus.FAILED);
    dispatch.setFailedAt(request != null && request.at() != null ? request.at() : LocalDateTime.now());
    dispatch.setErrorMessage(request == null ? null : request.message());
    dispatch.setAttempts(dispatch.getAttempts() + 1);
    return ReminderDispatchResponse.from(dispatches.save(dispatch));
  }

  @PatchMapping("/dispatches/{id}/pending")
  public ReminderDispatchResponse markPending(@PathVariable UUID id) {
    ReminderDispatch dispatch = dispatches.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Disparo nao encontrado"));
    dispatch.setStatus(ReminderDispatchStatus.PENDING);
    dispatch.setFailedAt(null);
    dispatch.setErrorMessage(null);
    return ReminderDispatchResponse.from(dispatches.save(dispatch));
  }

  private ReminderPreview toPreview(AgendaItem item) {
    LocalDateTime eventAt = LocalDateTime.of(
        item.getEventDate(),
        item.getStartTime() == null ? java.time.LocalTime.MIN : item.getStartTime());
    LocalDateTime reminderAt = eventAt.minusMinutes(item.getReminderMinutesBefore());
    String category = item.getCategory() == null || item.getCategory().isBlank() ? "Geral" : item.getCategory();
    String responsible = item.getResponsible() == null ? "Sem responsavel" : item.getResponsible().getName();
    String message = "%s: %s em %s. Responsavel: %s.".formatted(category, item.getTitle(), eventAt, responsible);

    return new ReminderPreview(item.getId().toString(), reminderAt, item.getWhatsappGroupName(), message);
  }

  private BotReminderItem toBotReminder(AgendaItem item) {
    LocalDateTime eventAt = eventAt(item);
    LocalDateTime reminderAt = dispatchAt(item, eventAt);
    String category = valueOrDefault(item.getCategory(), "Geral");
    List<BotAssignment> assignments = item.getAssignments().stream()
        .map(assignment -> {
          Employee employee = assignment.getEmployee();
          return new BotAssignment(
              employee.getId(),
              employee.getName(),
              employee.getPhoneNumber(),
              employee.getRoleName(),
              employee.isActive(),
              assignment.getCoverageRole().name());
        })
        .toList();
    BotResponsible responsible = item.getResponsible() == null
        ? null
        : new BotResponsible(
            item.getResponsible().getId(),
            item.getResponsible().getName(),
            item.getResponsible().getPhoneNumber(),
            item.getResponsible().getRoleName());
    List<BotDispatch> dispatches = List.of(new BotDispatch(
        "EVENT_REMINDER",
        reminderAt,
        item.getReminderMinutesBefore(),
        item.getWhatsappGroupName(),
        buildMessage(item, category, eventAt, assignments),
        mentionsForAssignments(assignments)));

    return new BotReminderItem(
        item.getId(),
        item.getTitle(),
        category,
        item.getStatus().name(),
        item.getEventDate(),
        item.getStartTime(),
        eventAt,
        item.getMeetingPoint(),
        item.getNotes(),
        responsible,
        assignments,
        dispatches);
  }

  private LocalDateTime eventAt(AgendaItem item) {
    return LocalDateTime.of(
        item.getEventDate(),
        item.getStartTime() == null ? LocalTime.MIN : item.getStartTime());
  }

  private LocalDateTime dispatchAt(AgendaItem item, LocalDateTime eventAt) {
    LocalTime startTime = item.getStartTime() == null ? LocalTime.MIN : item.getStartTime();
    if (startTime.isBefore(EARLY_EVENT_LIMIT)) {
      return item.getEventDate().minusDays(1).atTime(PREVIOUS_NIGHT_DISPATCH_TIME);
    }
    return eventAt.minusMinutes(item.getReminderMinutesBefore());
  }

  private String buildMessage(
      AgendaItem item,
      String category,
      LocalDateTime eventAt,
      List<BotAssignment> assignments) {
    String people = assignments.isEmpty()
        ? "Equipe: sem escalados."
        : "Equipe: " + assignments.stream()
            .map(assignment -> "%s (%s)".formatted(assignment.name(), assignment.coverageRole()))
            .reduce((left, right) -> left + ", " + right)
            .orElse("");
    String meetingPoint = item.getMeetingPoint() == null || item.getMeetingPoint().isBlank()
        ? "Ponto de encontro: nao informado."
        : "Ponto de encontro: " + item.getMeetingPoint() + ".";
    String notes = item.getNotes() == null || item.getNotes().isBlank()
        ? ""
        : " Observacoes: " + item.getNotes();

    return "[%s] %s em %s. %s %s%s".formatted(
        category,
        item.getTitle(),
        eventAt,
        people,
        meetingPoint,
        notes);
  }

  private String buildWeeklyMessage(LocalDate start, LocalDate end, List<BotReminderItem> items) {
    if (items.isEmpty()) {
      return "Agenda da semana (%s a %s): nenhuma pauta confirmada.".formatted(start, end);
    }

    String lines = items.stream()
        .map(item -> {
          String people = item.assignments().isEmpty()
              ? "sem escalados"
              : item.assignments().stream()
                  .map(assignment -> "%s (%s)".formatted(assignment.name(), assignment.coverageRole()))
                  .collect(Collectors.joining(", "));
          String meetingPoint = item.meetingPoint() == null || item.meetingPoint().isBlank()
              ? "ponto nao informado"
              : item.meetingPoint();
          return "- %s %s | %s | %s | %s".formatted(
              item.eventDate(),
              item.startTime() == null ? "--:--" : item.startTime(),
              item.title(),
              people,
              meetingPoint);
        })
        .collect(Collectors.joining("\n"));

    return "Agenda da semana (%s a %s):\n%s".formatted(start, end, lines);
  }

  private String firstGroupName(List<BotReminderItem> items) {
    return items.stream()
        .flatMap(item -> item.dispatches().stream())
        .map(BotDispatch::whatsappGroupName)
        .filter(group -> group != null && !group.isBlank())
        .findFirst()
        .orElse(null);
  }

  private List<BotMention> mentionsForItems(List<BotReminderItem> items) {
    return items.stream()
        .flatMap(item -> item.assignments().stream())
        .collect(Collectors.toMap(
            BotAssignment::employeeId,
            assignment -> new BotMention(assignment.employeeId(), assignment.name(), assignment.phoneNumber()),
            (first, ignored) -> first))
        .values()
        .stream()
        .toList();
  }

  private List<BotMention> mentionsForAssignments(List<BotAssignment> assignments) {
    return assignments.stream()
        .map(assignment -> new BotMention(assignment.employeeId(), assignment.name(), assignment.phoneNumber()))
        .toList();
  }

  private String valueOrDefault(String value, String fallback) {
    return value == null || value.isBlank() ? fallback : value;
  }

  private ReminderDispatch materialize(DispatchCandidate candidate) {
    return dispatches.findByDispatchKey(candidate.dispatchKey())
        .map(existing -> refreshPendingDispatch(existing, candidate))
        .orElseGet(() -> createDispatch(candidate));
  }

  private ReminderDispatch createDispatch(DispatchCandidate candidate) {
    ReminderDispatch dispatch = new ReminderDispatch();
    dispatch.setDispatchKey(candidate.dispatchKey());
    dispatch.setDispatchType(candidate.dispatch().type());
    applyDispatchContent(dispatch, candidate);
    return dispatches.save(dispatch);
  }

  private ReminderDispatch refreshPendingDispatch(ReminderDispatch dispatch, DispatchCandidate candidate) {
    if (dispatch.getStatus() != ReminderDispatchStatus.PENDING) {
      return dispatch;
    }
    applyDispatchContent(dispatch, candidate);
    return dispatches.save(dispatch);
  }

  private void applyDispatchContent(ReminderDispatch dispatch, DispatchCandidate candidate) {
    dispatch.setAgendaItem(candidate.agendaItemId() == null
        ? null
        : agendaItems.getReferenceById(candidate.agendaItemId()));
    dispatch.setScheduledAt(candidate.dispatch().scheduledAt());
    dispatch.setWhatsappGroupName(candidate.dispatch().whatsappGroupName());
    dispatch.setMessage(candidate.dispatch().message());
    dispatch.setPayload(toJson(candidate.payload()));
  }

  private String weeklyDispatchKey(WeeklySummary summary) {
    return "WEEKLY_DIGEST:%s:%s".formatted(summary.weekStart(), summary.dispatch().scheduledAt());
  }

  private String eventDispatchKey(UUID agendaItemId, BotDispatch dispatch) {
    return "%s:%s:%s".formatted(dispatch.type(), agendaItemId, dispatch.scheduledAt());
  }

  private String toJson(Object payload) {
    try {
      return objectMapper.writeValueAsString(payload);
    } catch (JsonProcessingException error) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Nao foi possivel serializar payload");
    }
  }

  public record ReminderPreview(
      String agendaItemId,
      LocalDateTime reminderAt,
      String whatsappGroupName,
      String message) {
  }

  public record BotReminderItem(
      UUID agendaItemId,
      String title,
      String category,
      String status,
      LocalDate eventDate,
      LocalTime startTime,
      LocalDateTime eventAt,
      String meetingPoint,
      String notes,
      BotResponsible responsible,
      List<BotAssignment> assignments,
      List<BotDispatch> dispatches) {
  }

  public record BotResponsible(
      UUID employeeId,
      String name,
      String phoneNumber,
      String roleName) {
  }

  public record BotAssignment(
      UUID employeeId,
      String name,
      String phoneNumber,
      String roleName,
      boolean active,
      String coverageRole) {
  }

  public record BotDispatch(
      String type,
      LocalDateTime scheduledAt,
      int minutesBeforeEvent,
      String whatsappGroupName,
      String message,
      List<BotMention> mentions) {
  }

  public record BotMention(
      UUID employeeId,
      String name,
      String phoneNumber) {
  }

  public record WeeklySummary(
      LocalDate weekStart,
      LocalDate weekEnd,
      BotDispatch dispatch,
      List<BotReminderItem> items) {
  }

  private record DispatchCandidate(
      String dispatchKey,
      UUID agendaItemId,
      BotDispatch dispatch,
      Object payload) {
  }

  public record DispatchResultRequest(
      LocalDateTime at,
      String message) {
  }

  public record ReminderDispatchResponse(
      UUID id,
      String dispatchKey,
      String dispatchType,
      UUID agendaItemId,
      LocalDateTime scheduledAt,
      String whatsappGroupName,
      String message,
      String payload,
      ReminderDispatchStatus status,
      LocalDateTime sentAt,
      LocalDateTime failedAt,
      String errorMessage,
      int attempts) {
    static ReminderDispatchResponse from(ReminderDispatch dispatch) {
      return new ReminderDispatchResponse(
          dispatch.getId(),
          dispatch.getDispatchKey(),
          dispatch.getDispatchType(),
          dispatch.getAgendaItem() == null ? null : dispatch.getAgendaItem().getId(),
          dispatch.getScheduledAt(),
          dispatch.getWhatsappGroupName(),
          dispatch.getMessage(),
          dispatch.getPayload(),
          dispatch.getStatus(),
          dispatch.getSentAt(),
          dispatch.getFailedAt(),
          dispatch.getErrorMessage(),
          dispatch.getAttempts());
    }
  }
}
