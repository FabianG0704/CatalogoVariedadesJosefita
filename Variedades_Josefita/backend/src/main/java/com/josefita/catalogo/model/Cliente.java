package com.josefita.catalogo.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tmclientes")
@Data
public class Cliente {

    @Id
    @Column(name = "pkcc_c")
    private Long cedula;

    @Column(name = "nom_c", nullable = false, length = 50)
    private String nombre;

    @Column(name = "dir_c", nullable = false, length = 50)
    private String direccion;

    @Column(name = "cel_c", nullable = false)
    private Long celular;

    @Column(name = "correo_c", nullable = false, unique = true, length = 50)
    private String correo;

    @Column(name = "password_c", nullable = false, length = 100)
    private String password;

    @ManyToOne
    @JoinColumn(name = "fkcod_sx", nullable = false)
    private Sexo sexo;

    @ManyToOne
    @JoinColumn(name = "fkcod_s_c", nullable = false)
    private Status status;
}