package com.vncs.assistente_governanca.controller;

import com.vncs.assistente_governanca.model.LogAuditoria;
import com.vncs.assistente_governanca.repository.LogAuditoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/logs")
public class LogAuditoriaController {

    @Autowired
    private LogAuditoriaRepository logAuditoriaRepository;

    // Create — normalmente será chamado pelo próprio sistema, não por um usuário manualmente
    @PostMapping
    public LogAuditoria criar(@RequestBody LogAuditoria log) {
        return logAuditoriaRepository.save(log);
    }

    // Read (todos) — para telas de auditoria/relatórios
    @GetMapping
    public List<LogAuditoria> listarTodos() {
        return logAuditoriaRepository.findAll();
    }

    // Read (por id) — para inspecionar um evento específico
    @GetMapping("/{id}")
    public ResponseEntity<LogAuditoria> buscarPorId(@PathVariable Long id) {
        return logAuditoriaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Propositalmente SEM @PutMapping e SEM @DeleteMapping:
    // um log de auditoria deve ser imutável e permanente por design.
}