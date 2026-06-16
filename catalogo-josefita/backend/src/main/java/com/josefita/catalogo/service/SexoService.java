package com.josefita.catalogo.service;

import com.josefita.catalogo.model.Sexo;
import com.josefita.catalogo.repository.SexoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SexoService {
    @Autowired
    private SexoRepository sexoRepository;

    public List<Sexo> listarTodo() { return sexoRepository.findAll(); }
    public Sexo guardar(Sexo sexo) { return sexoRepository.save(sexo); }
}