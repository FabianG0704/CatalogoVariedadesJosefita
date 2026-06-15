package com.josefita.catalogo.controller;

import com.josefita.catalogo.model.Prenda;
import com.josefita.catalogo.service.PrendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;

@RestController
@RequestMapping("/api/prendas")
@CrossOrigin(origins = "*")
public class PrendaController {

    @Autowired
    private PrendaService prendaService;

    // Lee la ruta de la carpeta desde application.yaml
    @Value("${app.imagenes.ruta}")
    private String rutaImagenes;

    // GET /api/prendas  → lista todas las prendas
    @GetMapping
    public List<Prenda> listar() {
        return prendaService.listarTodas();
    }

    // POST /api/prendas  → crea una prenda (sin imagen)
    @PostMapping
    public Prenda crear(@RequestBody Prenda prenda) {
        return prendaService.guardar(prenda);
    }

    // POST /api/prendas/upload  → sube una imagen y devuelve el nombre guardado
    @PostMapping("/upload")
    public ResponseEntity<String> subirImagen(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("El archivo está vacío.");
        }

        try {
            // Crea la carpeta si no existe
            Path carpeta = Paths.get(rutaImagenes);
            if (!Files.exists(carpeta)) {
                Files.createDirectories(carpeta);
            }

            // Nombre único: timestamp + nombre original
            String nombreArchivo = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path destino = carpeta.resolve(nombreArchivo);
            Files.copy(file.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

            return ResponseEntity.ok(nombreArchivo);

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body("Error al guardar la imagen: " + e.getMessage());
        }
    }

    // PUT /api/prendas/{id}/imagen  → asocia una imagen ya subida a una prenda
    @PutMapping("/{id}/imagen")
    public ResponseEntity<Prenda> asignarImagen(@PathVariable Integer id,
                                                 @RequestParam("nombreArchivo") String nombreArchivo) {
        return prendaService.buscarPorId(id)
                .map(prenda -> {
                    prenda.setImagen(nombreArchivo);
                    return ResponseEntity.ok(prendaService.guardar(prenda));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Prenda> editar(@PathVariable Integer id,
                                         @RequestBody Prenda datos) {
        return prendaService.buscarPorId(id)
                .map(prenda -> {
                    prenda.setNombre(datos.getNombre());
                    prenda.setPrecio(datos.getPrecio());
                    prenda.setTalla(datos.getTalla());
                    prenda.setColor(datos.getColor());
                    prenda.setSexo(datos.getSexo());
                    return ResponseEntity.ok(prendaService.guardar(prenda));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/prendas/{id}  → elimina una prenda
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        return prendaService.buscarPorId(id)
                .map(prenda -> {
                    prendaService.eliminar(id);
                    return ResponseEntity.ok(Map.of("ok", true));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
