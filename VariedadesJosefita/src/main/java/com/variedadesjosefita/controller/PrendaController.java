package com.variedadesjosefita.controller;

import com.variedadesjosefita.model.Prenda;
import com.variedadesjosefita.service.PrendaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/prendas")
public class PrendaController {

    private final PrendaService prendaService;

    public PrendaController(PrendaService prendaService) {
        this.prendaService = prendaService;
    }

    @GetMapping
    public List<Prenda> listar() {
        return prendaService.listarActivas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prenda> obtener(@PathVariable Long id) {
        Prenda prenda = prendaService.obtenerPorId(id);
        if (prenda == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(prenda);
    }

    @PostMapping
    public Prenda crear(@RequestBody Prenda prenda) {
        return prendaService.guardar(prenda);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Prenda> actualizar(@PathVariable Long id, @RequestBody Prenda prenda) {
        Prenda actualizada = prendaService.actualizar(id, prenda);
        if (actualizada == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(actualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        prendaService.eliminarLogico(id);
        return ResponseEntity.ok().build();
    }
}
