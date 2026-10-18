package com.vncs.assistente_governanca.controller;

import com.vncs.assistente_governanca.model.Usuario;
import com.vncs.assistente_governanca.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Create
    @PostMapping
    public Usuario criar(@RequestBody Usuario usuario) {
        // Antes de salvar, criptografamos a senha recebida em texto puro
        usuario.setSenhaHash(passwordEncoder.encode(usuario.getSenhaHash()));
        return usuarioRepository.save(usuario);
    }

    // Read (todos)
    @GetMapping
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    // Read (por id)
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        return usuario.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(@PathVariable Long id, @RequestBody Usuario dadosAtualizados) {
        return usuarioRepository.findById(id)
                .map(usuarioExistente -> {
                    usuarioExistente.setNome(dadosAtualizados.getNome());
                    usuarioExistente.setEmail(dadosAtualizados.getEmail());
                    // Só recriptografa se uma nova senha foi enviada
                    if (dadosAtualizados.getSenhaHash() != null && !dadosAtualizados.getSenhaHash().isBlank()) {
                        usuarioExistente.setSenhaHash(passwordEncoder.encode(dadosAtualizados.getSenhaHash()));
                    }
                    usuarioExistente.setPapel(dadosAtualizados.getPapel());
                    return ResponseEntity.ok(usuarioRepository.save(usuarioExistente));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!usuarioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        usuarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}