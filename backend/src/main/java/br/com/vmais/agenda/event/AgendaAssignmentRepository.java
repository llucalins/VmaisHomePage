package br.com.vmais.agenda.event;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AgendaAssignmentRepository extends JpaRepository<AgendaAssignment, UUID> {
  @Modifying
  @Query("delete from AgendaAssignment assignment where assignment.employee.id = :employeeId")
  void deleteByEmployeeId(@Param("employeeId") UUID employeeId);
}
