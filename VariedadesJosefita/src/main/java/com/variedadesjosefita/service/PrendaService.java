package com.variedadesjosefita.service;

import com.variedadesjosefita.model.Prenda;
import com.variedadesjosefita.repository.PrendaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PrendaService {

    private final PrendaRepository prendaRepository;

    public PrendaService(PrendaRepository prendaRepository) {
        this.prendaRepository = prendaRepository;
    }

    public List<Prenda> listarActivas() {
        return prendaRepository.findByActivoTrue();
    }

    public List<Prenda> listarPorCategoria(String categoria) {
        return prendaRepository.findByCategoriaAndActivoTrue(categoria);
    }

    public List<Prenda> listarPorGenero(String genero) {
        return prendaRepository.findByGeneroAndActivoTrue(genero);
    }

    public Prenda obtenerPorId(Long id) {
        return prendaRepository.findById(id).orElse(null);
    }

    public Prenda guardar(Prenda prenda) {
        return prendaRepository.save(prenda);
    }

    public Prenda actualizar(Long id, Prenda prenda) {
        Prenda existente = prendaRepository.findById(id).orElse(null);
        if (existente == null) return null;
        existente.setNombre(prenda.getNombre());
        existente.setTalla(prenda.getTalla());
        existente.setColor(prenda.getColor());
        existente.setPrecio(prenda.getPrecio());
        existente.setCategoria(prenda.getCategoria());
        existente.setGenero(prenda.getGenero());
        existente.setImagenUrl(prenda.getImagenUrl());
        return prendaRepository.save(existente);
    }

    public void eliminarLogico(Long id) {
        Prenda prenda = prendaRepository.findById(id).orElse(null);
        if (prenda != null) {
            prenda.setActivo(false);
            prendaRepository.save(prenda);
        }
    }
}
