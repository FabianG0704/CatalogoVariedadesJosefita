package com.josefita.catalogo.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tmstatus")
@Data
public class Status {
    @Id
    @Column(name = "pkcod_s")
    private Integer id;

    @Column(name = "dstatus", nullable = false, length = 12)
    private String descripcion;
}