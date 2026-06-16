package com.josefita.catalogo.controller;

import com.josefita.catalogo.model.Cliente;
import com.josefita.catalogo.model.Sexo;
import com.josefita.catalogo.model.Status;
import com.josefita.catalogo.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @GetMapping
    public List<Cliente> listar() {
        return clienteService.listarTodos();
    }

    // POST /api/clientes/login
    // Body: { "correo": "...", "password": "..." }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String correo   = body.get("correo");
        String password = body.get("password");

        if (correo == null || password == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Correo y contraseña son obligatorios."));
        }

        Optional<Cliente> cliente = clienteService.login(correo, password);

        if (cliente.isEmpty()) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Correo o contraseña incorrectos."));
        }

        Cliente c = cliente.get();

        // Devuelve solo los datos necesarios al front (nunca la contraseña)
        return ResponseEntity.ok(Map.of(
                "cedula",  c.getCedula(),
                "nombre",  c.getNombre(),
                "correo",  c.getCorreo(),
                "esAdmin", c.getCorreo().equals("josefita@josefita.com")
        ));
    }

    // POST /api/clientes/registro
    // Body: { "cedula": 123, "nombre": "...", "correo": "...", "password": "...",
    //         "direccion": "...", "celular": 123, "sexoId": "M" }
    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody Map<String, Object> body) {
        try {
            String correo = (String) body.get("correo");

            if (clienteService.correoExiste(correo)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Este correo ya está registrado."));
            }

            Cliente cliente = new Cliente();
            cliente.setCedula(Long.parseLong(body.get("cedula").toString()));
            cliente.setNombre((String) body.get("nombre"));
            cliente.setCorreo(correo);
            cliente.setPassword((String) body.get("password"));
            cliente.setDireccion((String) body.get("direccion"));
            cliente.setCelular(Long.parseLong(body.get("celular").toString()));

            // Sexo: recibe el id ("M", "F", "O")
            Sexo sexo = new Sexo();
            sexo.setId((String) body.get("sexoId"));
            cliente.setSexo(sexo);

            // Status 1 = Activo por defecto
            Status status = new Status();
            status.setId(1);
            cliente.setStatus(status);

            Cliente guardado = clienteService.guardar(cliente);

            return ResponseEntity.ok(Map.of(
                    "cedula",  guardado.getCedula(),
                    "nombre",  guardado.getNombre(),
                    "correo",  guardado.getCorreo(),
                    "esAdmin", false
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error al registrar: " + e.getMessage()));
        }
    }
}