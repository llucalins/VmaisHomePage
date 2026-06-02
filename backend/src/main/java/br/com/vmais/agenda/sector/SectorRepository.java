package br.com.vmais.agenda.sector;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SectorRepository extends JpaRepository<Sector, UUID> {
  List<Sector> findAllByOrderByNameAsc();
}
