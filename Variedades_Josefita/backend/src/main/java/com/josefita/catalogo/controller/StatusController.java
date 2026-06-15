package com.josefita.catalogo.controller;

import com.josefita.catalogo.model.Status;
import com.josefita.catalogo.service.StatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/status")
public class StatusController {
    @Autowired
    private StatusService statusService;

    @GetMapping
    public List<Status> listar() { return statusService.listarTodo(); }

    @PostMapping
    public Status crear(@RequestBody Status status) { return statusService.guardar(status); }
}