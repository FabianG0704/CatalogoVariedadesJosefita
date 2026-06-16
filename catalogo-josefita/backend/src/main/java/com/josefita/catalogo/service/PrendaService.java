package com.josefita.catalogo.service;

import com.josefita.catalogo.model.Prenda;
import com.josefita.catalogo.repository.PrendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PrendaService {

    @Autowired
    private PrendaRepository prendaRepository;

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
            prenda.getStatus().setId(0);
            prendaRepository.save(prenda);
        });
    }
}
