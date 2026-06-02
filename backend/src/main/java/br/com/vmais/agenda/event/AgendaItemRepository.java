package br.com.vmais.agenda.event;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgendaItemRepository extends JpaRepository<AgendaItem, UUID> {
  @EntityGraph(attributePaths = {"sector", "responsible", "assignments", "assignments.employee"})
  List<AgendaItem> findByEventDateBetweenOrderByEventDateAscStartTimeAsc(LocalDate from, LocalDate to);
}
