package com.vncs.assistente_governanca.repository;

import com.vncs.assistente_governanca.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email); // útil para o login
}