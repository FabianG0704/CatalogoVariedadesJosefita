package com.josefita.catalogo.service;

import com.josefita.catalogo.model.Status;
import com.josefita.catalogo.repository.StatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StatusService {
    @Autowired
    private StatusRepository statusRepository;

    public List<Status> listarTodo() { return statusRepository.findAll(); }
    public Status guardar(Status status) { return statusRepository.save(status); }
}