package com.josefita.catalogo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "tmprendas")
@Data
public class Prenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pkcod_p")
    private Integer id;

    @Column(name = "nom_p", nullable = false, length = 40)
    private String nombre;

    @Column(nullable = false, length = 5)
    private String talla;

    @Column(nullable = false, length = 30)
    private String color;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal precio;

    @Column(name = "imagen", length = 100)
    private String imagen;

    @ManyToOne
    @JoinColumn(name = "fkcod_s_p", nullable = false)
    private Status status;

    @ManyToOne
    @JoinColumn(name = "fkcod_sx_p", nullable = false)
    private Sexo sexo;
}
