package br.com.vmais.agenda.reminder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReminderDispatchRepository extends JpaRepository<ReminderDispatch, UUID> {
  Optional<ReminderDispatch> findByDispatchKey(String dispatchKey);

  List<ReminderDispatch> findByStatusAndScheduledAtLessThanEqualOrderByScheduledAtAsc(
      ReminderDispatchStatus status,
      LocalDateTime scheduledAt);
}
