package br.com.vmais.agenda.event;

import br.com.vmais.agenda.employee.Employee;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "agenda_assignments")
public class AgendaAssignment {
  @Id
  @GeneratedValue
  private UUID id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "agenda_item_id")
  private AgendaItem agendaItem;

  @ManyToOne(optional = false)
  @JoinColumn(name = "employee_id")
  private Employee employee;

  @Enumerated(EnumType.STRING)
  @Column(name = "coverage_role", nullable = false, length = 40)
  private CoverageRole coverageRole;

  public UUID getId() {
    return id;
  }

  public AgendaItem getAgendaItem() {
    return agendaItem;
  }

  public void setAgendaItem(AgendaItem agendaItem) {
    this.agendaItem = agendaItem;
  }

  public Employee getEmployee() {
    return employee;
  }

  public void setEmployee(Employee employee) {
    this.employee = employee;
  }

  public CoverageRole getCoverageRole() {
    return coverageRole;
  }

  public void setCoverageRole(CoverageRole coverageRole) {
    this.coverageRole = coverageRole;
  }
}
