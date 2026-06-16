package com.josefita.catalogo.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.josefita.catalogo.model.Prenda;
import com.josefita.catalogo.service.PrendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prendas")
@CrossOrigin(origins = "*")
public class PrendaController {

    @Autowired
    private PrendaService prendaService;

    @Autowired
    private Cloudinary cloudinary;

    // GET /api/prendas → lista todas las prendas activas
    @GetMapping
    public List<Prenda> listar() {
        return prendaService.listarTodas();
    }

    // POST /api/prendas → crea una prenda (sin imagen)
    @PostMapping
    public Prenda crear(@RequestBody Prenda prenda) {
        return prendaService.guardar(prenda);
    }

    // POST /api/prendas/upload → sube la imagen a Cloudinary y devuelve la URL permanente
    @PostMapping("/upload")
    public ResponseEntity<String> subirImagen(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("El archivo está vacío.");
        }

        try {
            // Sube el archivo a Cloudinary en la carpeta "josefita"
            Map resultado = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "josefita",
                            "resource_type", "image"
                    )
            );

            // Devuelve la URL segura permanente de Cloudinary
            String urlImagen = (String) resultado.get("secure_url");
            return ResponseEntity.ok(urlImagen);

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body("Error al subir la imagen: " + e.getMessage());
        }
    }

    // PUT /api/prendas/{id}/imagen → asocia la URL de Cloudinary a la prenda
    @PutMapping("/{id}/imagen")
    public ResponseEntity<Prenda> asignarImagen(@PathVariable Integer id,
                                                 @RequestParam("nombreArchivo") String urlImagen) {
        return prendaService.buscarPorId(id)
                .map(prenda -> {
                    prenda.setImagen(urlImagen);  // ahora guarda la URL completa de Cloudinary
                    return ResponseEntity.ok(prendaService.guardar(prenda));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT /api/prendas/{id} → edita los datos de una prenda
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

    // DELETE /api/prendas/{id} → eliminación lógica
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
