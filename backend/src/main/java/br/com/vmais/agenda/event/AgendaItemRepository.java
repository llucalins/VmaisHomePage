package br.com.vmais.agenda.event;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AgendaItemRepository extends JpaRepository<AgendaItem, UUID> {
  @EntityGraph(attributePaths = {"sector", "responsible", "assignments", "assignments.employee"})
  List<AgendaItem> findByEventDateBetweenOrderByEventDateAscStartTimeAsc(LocalDate from, LocalDate to);

  @EntityGraph(attributePaths = {"sector", "responsible", "assignments", "assignments.employee"})
  @Query("select item from AgendaItem item where item.id = :id")
  Optional<AgendaItem> findDetailedById(@Param("id") UUID id);

  @Modifying
  @Query("update AgendaItem item set item.responsible = null where item.responsible.id = :employeeId")
  void clearResponsibleByEmployeeId(@Param("employeeId") UUID employeeId);
}
