package com.josefita.catalogo.model;

import jakarta.persistence.Embeddable;
import lombok.Data;
import java.io.Serializable;

@Embeddable
@Data
public class FavoritoId implements Serializable {
    private Long cedula;
    private Integer prendaId;
}