package br.com.vmais.agenda.employee;

import br.com.vmais.agenda.sector.Sector;
import br.com.vmais.agenda.sector.SectorRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
  private final EmployeeRepository employees;
  private final SectorRepository sectors;

  public EmployeeController(EmployeeRepository employees, SectorRepository sectors) {
    this.employees = employees;
    this.sectors = sectors;
  }

  @GetMapping
  public List<EmployeeResponse> list() {
    return employees.findAllByOrderByNameAsc().stream()
        .map(EmployeeResponse::from)
        .toList();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public EmployeeResponse create(@Valid @RequestBody EmployeeRequest request) {
    Employee employee = new Employee();
    apply(employee, request);
    return EmployeeResponse.from(employees.save(employee));
  }

  @PutMapping("/{id}")
  public EmployeeResponse update(@PathVariable UUID id, @Valid @RequestBody EmployeeRequest request) {
    Employee employee = employees.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionario nao encontrado"));
    apply(employee, request);
    return EmployeeResponse.from(employees.save(employee));
  }

  private void apply(Employee employee, EmployeeRequest request) {
    Sector sector = request.sectorId() == null ? null : sectors.findById(request.sectorId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Setor nao encontrado"));

    employee.setName(request.name().trim());
    employee.setPhoneNumber(request.phoneNumber().trim());
    employee.setRoleName(request.roleName());
    employee.setSector(sector);
    employee.setActive(request.active());
  }

  public record EmployeeRequest(
      @NotBlank String name,
      @NotBlank String phoneNumber,
      String roleName,
      UUID sectorId,
      boolean active) {
  }

  public record EmployeeResponse(
      UUID id,
      String name,
      String phoneNumber,
      String roleName,
      UUID sectorId,
      String sectorName,
      boolean active) {
    static EmployeeResponse from(Employee employee) {
      Sector sector = employee.getSector();
      return new EmployeeResponse(
          employee.getId(),
          employee.getName(),
          employee.getPhoneNumber(),
          employee.getRoleName(),
          sector == null ? null : sector.getId(),
          sector == null ? null : sector.getName(),
          employee.isActive());
    }
  }
}
