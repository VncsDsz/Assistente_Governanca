package com.vncs.assistente_governanca.controller;

import com.vncs.assistente_governanca.model.DadosCliente;
import com.vncs.assistente_governanca.repository.DadosClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
public class DadosClienteController {

    @Autowired
    private DadosClienteRepository dadosClienteRepository;

    @PostMapping
    public DadosCliente criar(@RequestBody DadosCliente cliente) {
        return dadosClienteRepository.save(cliente);
    }

    @GetMapping
    public List<DadosCliente> listarTodos() {
        return dadosClienteRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DadosCliente> buscarPorId(@PathVariable Long id) {
        return dadosClienteRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<DadosCliente> atualizar(@PathVariable Long id, @RequestBody DadosCliente dados) {
        return dadosClienteRepository.findById(id)
                .map(clienteExistente -> {
                    clienteExistente.setNomeEmpresa(dados.getNomeEmpresa());
                    clienteExistente.setSetorAtuacao(dados.getSetorAtuacao());
                    clienteExistente.setScoreCredito(dados.getScoreCredito());
                    clienteExistente.setDataCadastro(dados.getDataCadastro());
                    return ResponseEntity.ok(dadosClienteRepository.save(clienteExistente));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!dadosClienteRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        dadosClienteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}