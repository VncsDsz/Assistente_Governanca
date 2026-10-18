package com.vncs.assistente_governanca.repository;

import com.vncs.assistente_governanca.model.DadosCliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DadosClienteRepository extends JpaRepository<DadosCliente, Long> {
}