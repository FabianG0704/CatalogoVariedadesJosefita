package com.josefita.catalogo.service;

import com.josefita.catalogo.model.Cliente;
import com.josefita.catalogo.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    public Cliente guardar(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    // Busca un cliente por correo y verifica la contraseña
    public Optional<Cliente> login(String correo, String password) {
        return clienteRepository.findByCorreo(correo)
                .filter(c -> c.getPassword().equals(password));
    }

    // Verifica si el correo ya está registrado
    public boolean correoExiste(String correo) {
        return clienteRepository.existsByCorreo(correo);
    }
}
