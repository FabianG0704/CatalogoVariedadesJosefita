package com.josefita.catalogo.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tmfavoritos")
@Data
public class Favorito {

    @EmbeddedId
    private FavoritoId id;

    @ManyToOne
    @MapsId("cedula")
    @JoinColumn(name = "fkcedula_c")
    private Cliente cliente;

    @ManyToOne
    @MapsId("prendaId")
    @JoinColumn(name = "fkcod_p")
    private Prenda prenda;
}