package com.josefita.catalogo.repository;

import com.josefita.catalogo.model.Prenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrendaRepository extends JpaRepository<Prenda, Integer> {
    List<Prenda> findByStatusIdNot(Integer statusId);
}
