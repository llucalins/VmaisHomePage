package br.com.vmais.agenda.sector;

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
@RequestMapping("/api/sectors")
public class SectorController {
  private final SectorRepository sectors;

  public SectorController(SectorRepository sectors) {
    this.sectors = sectors;
  }

  @GetMapping
  public List<SectorResponse> list() {
    return sectors.findAllByOrderByNameAsc().stream()
        .map(SectorResponse::from)
        .toList();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public SectorResponse create(@Valid @RequestBody SectorRequest request) {
    Sector sector = new Sector();
    apply(sector, request);
    return SectorResponse.from(sectors.save(sector));
  }

  @PutMapping("/{id}")
  public SectorResponse update(@PathVariable UUID id, @Valid @RequestBody SectorRequest request) {
    Sector sector = sectors.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Setor nao encontrado"));
    apply(sector, request);
    return SectorResponse.from(sectors.save(sector));
  }

  private void apply(Sector sector, SectorRequest request) {
    sector.setName(request.name().trim());
    sector.setColor(request.color() == null || request.color().isBlank() ? "#111111" : request.color().trim());
    sector.setActive(request.active());
  }

  public record SectorRequest(@NotBlank String name, String color, boolean active) {
  }

  public record SectorResponse(UUID id, String name, String color, boolean active) {
    static SectorResponse from(Sector sector) {
      return new SectorResponse(sector.getId(), sector.getName(), sector.getColor(), sector.isActive());
    }
  }
}
