package com.josefita.catalogo.controller;

import com.josefita.catalogo.model.Sexo;
import com.josefita.catalogo.service.SexoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sexo")
public class SexoController {
    @Autowired
    private SexoService sexoService;

    @GetMapping
    public List<Sexo> listar() { return sexoService.listarTodo(); }

    @PostMapping
    public Sexo crear(@RequestBody Sexo sexo) { return sexoService.guardar(sexo); }
}