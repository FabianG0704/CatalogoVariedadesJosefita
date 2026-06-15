package com.josefita.catalogo.repository;

import com.josefita.catalogo.model.Favorito;
import com.josefita.catalogo.model.FavoritoId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FavoritoRepository extends JpaRepository<Favorito, FavoritoId> {
    List<Favorito> findByClienteCedula(Long cedula);
}