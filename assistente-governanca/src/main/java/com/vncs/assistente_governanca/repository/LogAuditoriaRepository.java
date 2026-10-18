package com.vncs.assistente_governanca.repository;

import com.vncs.assistente_governanca.model.LogAuditoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogAuditoriaRepository extends JpaRepository<LogAuditoria, Long> {
}