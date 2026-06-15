package com.josefita.catalogo.service;

import com.josefita.catalogo.model.Prenda;
import com.josefita.catalogo.model.Status;
import com.josefita.catalogo.repository.PrendaRepository;
import com.josefita.catalogo.repository.StatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PrendaService {

    @Autowired
    private PrendaRepository prendaRepository;

    @Autowired
    private StatusRepository statusRepository;  // ← NUEVO

    public List<Prenda> listarTodas() {
        return prendaRepository.findAll();
    }

    public Prenda guardar(Prenda prenda) {
        return prendaRepository.save(prenda);
    }

    public Optional<Prenda> buscarPorId(Integer id) {
        return prendaRepository.findById(id);
    }

    public void eliminar(Integer id) {
        buscarPorId(id).ifPresent(prenda -> {
            Status inactivo = statusRepository.findById(0)  // ← carga el registro real de la BD
                    .orElseThrow(() -> new RuntimeException("Status 0 no existe en tmstatus"));
            prenda.setStatus(inactivo);
            prendaRepository.save(prenda);
        });
    }
}