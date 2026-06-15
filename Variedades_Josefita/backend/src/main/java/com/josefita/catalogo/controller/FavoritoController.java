package com.josefita.catalogo.controller;

import com.josefita.catalogo.model.*;
import com.josefita.catalogo.repository.FavoritoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/favoritos")
@CrossOrigin(origins = "*")
public class FavoritoController {

    @Autowired
    private FavoritoRepository favoritoRepo;

    // GET /api/favoritos/{cedula}  → lista los IDs de prendas favoritas del usuario
    @GetMapping("/{cedula}")
    public List<Integer> listar(@PathVariable Long cedula) {
        return favoritoRepo.findByClienteCedula(cedula)
                .stream()
                .map(f -> f.getPrenda().getId())
                .collect(Collectors.toList());
    }

    // POST /api/favoritos  → agrega favorito
    // Body: { "cedula": 123, "prendaId": 5 }
    @PostMapping
    public ResponseEntity<?> agregar(@RequestBody Map<String, Object> body) {
        FavoritoId id = new FavoritoId();
        id.setCedula(Long.parseLong(body.get("cedula").toString()));
        id.setPrendaId(Integer.parseInt(body.get("prendaId").toString()));

        Favorito fav = new Favorito();
        fav.setId(id);

        Cliente c = new Cliente(); c.setCedula(id.getCedula());
        Prenda p  = new Prenda();  p.setId(id.getPrendaId());
        fav.setCliente(c);
        fav.setPrenda(p);

        favoritoRepo.save(fav);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // DELETE /api/favoritos/{cedula}/{prendaId}  → elimina favorito
    @DeleteMapping("/{cedula}/{prendaId}")
    public ResponseEntity<?> eliminar(@PathVariable Long cedula,
                                      @PathVariable Integer prendaId) {
        FavoritoId id = new FavoritoId();
        id.setCedula(cedula);
        id.setPrendaId(prendaId);
        favoritoRepo.deleteById(id);
        return ResponseEntity.ok(Map.of("ok", true));
    }
}