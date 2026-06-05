package br.com.vmais.agenda.event;

import br.com.vmais.agenda.admin.AdminUser;
import br.com.vmais.agenda.employee.Employee;
import br.com.vmais.agenda.employee.EmployeeRepository;
import br.com.vmais.agenda.sector.Sector;
import br.com.vmais.agenda.sector.SectorRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/agenda-items")
public class AgendaItemController {
  private final AgendaItemRepository agendaItems;
  private final SectorRepository sectors;
  private final EmployeeRepository employees;

  public AgendaItemController(
      AgendaItemRepository agendaItems,
      SectorRepository sectors,
      EmployeeRepository employees) {
    this.agendaItems = agendaItems;
    this.sectors = sectors;
    this.employees = employees;
  }

  @GetMapping
  public List<AgendaItemResponse> list(
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
    LocalDate start = from == null ? LocalDate.now().minusDays(30) : from;
    LocalDate end = to == null ? LocalDate.now().plusDays(365) : to;
    return agendaItems.findByEventDateBetweenOrderByEventDateAscStartTimeAsc(start, end).stream()
        .map(AgendaItemResponse::from)
        .toList();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public AgendaItemResponse create(
      @AuthenticationPrincipal AdminUser admin,
      @Valid @RequestBody AgendaItemRequest request) {
    AgendaItem item = new AgendaItem();
    item.setCreatedBy(admin);
    apply(item, request);
    return AgendaItemResponse.from(agendaItems.save(item));
  }

  @PutMapping("/{id}")
  public AgendaItemResponse update(@PathVariable UUID id, @Valid @RequestBody AgendaItemRequest request) {
    AgendaItem item = agendaItems.findDetailedById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item de agenda nao encontrado"));
    apply(item, request);
    return AgendaItemResponse.from(agendaItems.save(item));
  }

  @PatchMapping("/{id}/status")
  public AgendaItemResponse updateStatus(@PathVariable UUID id, @Valid @RequestBody StatusRequest request) {
    AgendaItem item = agendaItems.findDetailedById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item de agenda nao encontrado"));
    item.setStatus(request.status());
    return AgendaItemResponse.from(agendaItems.save(item));
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable UUID id) {
    if (!agendaItems.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item de agenda nao encontrado");
    }
    agendaItems.deleteById(id);
  }

  private void apply(AgendaItem item, AgendaItemRequest request) {
    Sector sector = request.sectorId() == null ? null : sectors.findById(request.sectorId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Setor nao encontrado"));
    Employee responsible = request.responsibleId() == null ? null : employees.findById(request.responsibleId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionario nao encontrado"));

    item.setTitle(request.title().trim());
    item.setDescription(request.description());
    item.setEventDate(request.eventDate());
    item.setStartTime(request.startTime());
    item.setEndTime(request.endTime());
    item.setStatus(request.status() == null ? AgendaStatus.TODO : request.status());
    item.setPriority(request.priority() == null ? Priority.NORMAL : request.priority());
    item.setWorkType(request.workType() == null ? WorkType.COVERAGE : request.workType());
    item.setCategory(request.category() == null || request.category().isBlank() ? null : request.category().trim());
    item.setMeetingPoint(request.meetingPoint() == null || request.meetingPoint().isBlank() ? null : request.meetingPoint().trim());
    item.setNotes(request.notes() == null || request.notes().isBlank() ? null : request.notes().trim());
    item.setWhatsappGroupName(request.whatsappGroupName());
    item.setReminderMinutesBefore(request.reminderMinutesBefore());
    item.setSector(sector);
    item.setResponsible(responsible);
    item.getAssignments().clear();
    if (request.assignments() != null) {
      List<AgendaAssignment> assignments = new ArrayList<>();
      for (AssignmentRequest assignmentRequest : request.assignments()) {
        if (assignmentRequest.employeeId() == null || assignmentRequest.coverageRole() == null) {
          continue;
        }
        Employee employee = employees.findById(assignmentRequest.employeeId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionario nao encontrado"));
        AgendaAssignment assignment = new AgendaAssignment();
        assignment.setAgendaItem(item);
        assignment.setEmployee(employee);
        assignment.setCoverageRole(assignmentRequest.coverageRole());
        assignments.add(assignment);
      }
      item.getAssignments().addAll(assignments);
    }
  }

  public record AgendaItemRequest(
      @NotBlank String title,
      String description,
      @NotNull LocalDate eventDate,
      LocalTime startTime,
      LocalTime endTime,
      AgendaStatus status,
      Priority priority,
      WorkType workType,
      String category,
      String meetingPoint,
      String notes,
      UUID sectorId,
      UUID responsibleId,
      String whatsappGroupName,
      @Min(0) int reminderMinutesBefore,
      List<AssignmentRequest> assignments) {
  }

  public record StatusRequest(@NotNull AgendaStatus status) {
  }

  public record AssignmentRequest(UUID employeeId, CoverageRole coverageRole) {
  }

  public record AssignmentResponse(UUID employeeId, String employeeName, CoverageRole coverageRole) {
    static AssignmentResponse from(AgendaAssignment assignment) {
      Employee employee = assignment.getEmployee();
      return new AssignmentResponse(employee.getId(), employee.getName(), assignment.getCoverageRole());
    }
  }

  public record AgendaItemResponse(
      UUID id,
      String title,
      String description,
      LocalDate eventDate,
      LocalTime startTime,
      LocalTime endTime,
      AgendaStatus status,
      Priority priority,
      WorkType workType,
      String category,
      String meetingPoint,
      String notes,
      UUID sectorId,
      String sectorName,
      String sectorColor,
      UUID responsibleId,
      String responsibleName,
      String whatsappGroupName,
      int reminderMinutesBefore,
      List<AssignmentResponse> assignments) {
    static AgendaItemResponse from(AgendaItem item) {
      Sector sector = item.getSector();
      Employee responsible = item.getResponsible();
      return new AgendaItemResponse(
          item.getId(),
          item.getTitle(),
          item.getDescription(),
          item.getEventDate(),
          item.getStartTime(),
          item.getEndTime(),
          item.getStatus(),
          item.getPriority(),
          item.getWorkType(),
          item.getCategory(),
          item.getMeetingPoint(),
          item.getNotes(),
          sector == null ? null : sector.getId(),
          sector == null ? null : sector.getName(),
          sector == null ? null : sector.getColor(),
          responsible == null ? null : responsible.getId(),
          responsible == null ? null : responsible.getName(),
          item.getWhatsappGroupName(),
          item.getReminderMinutesBefore(),
          item.getAssignments().stream().map(AssignmentResponse::from).toList());
    }
  }
}
