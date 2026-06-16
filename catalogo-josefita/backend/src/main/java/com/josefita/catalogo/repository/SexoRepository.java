package com.josefita.catalogo.repository;

import com.josefita.catalogo.model.Sexo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SexoRepository extends JpaRepository<Sexo, String> {
}