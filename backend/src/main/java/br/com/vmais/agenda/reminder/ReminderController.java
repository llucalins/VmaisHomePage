package br.com.vmais.agenda.reminder;

import br.com.vmais.agenda.event.AgendaItem;
import br.com.vmais.agenda.event.AgendaItemRepository;
import br.com.vmais.agenda.event.AgendaStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {
  private final AgendaItemRepository agendaItems;

  public ReminderController(AgendaItemRepository agendaItems) {
    this.agendaItems = agendaItems;
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

  private ReminderPreview toPreview(AgendaItem item) {
    LocalDateTime eventAt = LocalDateTime.of(
        item.getEventDate(),
        item.getStartTime() == null ? java.time.LocalTime.MIN : item.getStartTime());
    LocalDateTime reminderAt = eventAt.minusMinutes(item.getReminderMinutesBefore());
    String sector = item.getSector() == null ? "Geral" : item.getSector().getName();
    String responsible = item.getResponsible() == null ? "Sem responsavel" : item.getResponsible().getName();
    String message = "%s: %s em %s. Responsavel: %s.".formatted(sector, item.getTitle(), eventAt, responsible);

    return new ReminderPreview(item.getId().toString(), reminderAt, item.getWhatsappGroupName(), message);
  }

  public record ReminderPreview(
      String agendaItemId,
      LocalDateTime reminderAt,
      String whatsappGroupName,
      String message) {
  }
}
