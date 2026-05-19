package com.variedadesjosefita.repository;

import com.variedadesjosefita.model.Prenda;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PrendaRepository extends JpaRepository<Prenda, Long> {
    List<Prenda> findByActivoTrue();
    List<Prenda> findByCategoriaAndActivoTrue(String categoria);
    List<Prenda> findByGeneroAndActivoTrue(String genero);
}
