package com.variedadesjosefita.controller;

import com.variedadesjosefita.dto.LoginRequest;
import com.variedadesjosefita.model.Usuario;
import com.variedadesjosefita.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Usuario usuario = usuarioService.autenticar(request.getUsername(), request.getPassword());
        if (usuario == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales invalidas"));
        }
        return ResponseEntity.ok(Map.of(
            "username", usuario.getUsername(),
            "rol", usuario.getRol()
        ));
    }
}
