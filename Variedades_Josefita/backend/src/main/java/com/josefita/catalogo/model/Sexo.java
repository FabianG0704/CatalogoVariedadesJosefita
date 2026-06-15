package com.josefita.catalogo.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tmsexo")
@Data
public class Sexo {
    @Id
    @Column(name = "pkcod_sx", length = 1)
    private String id;

    @Column(name = "dsexo", nullable = false, length = 15)
    private String descripcion;
}