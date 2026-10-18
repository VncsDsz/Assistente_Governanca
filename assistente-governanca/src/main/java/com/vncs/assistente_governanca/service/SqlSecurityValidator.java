package com.vncs.assistente_governanca.service;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SqlSecurityValidator {

    private static final List<String> PALAVRAS_BLOQUEADAS = List.of(
            "UPDATE", "DELETE", "DROP", "INSERT", "ALTER", "TRUNCATE",
            "CREATE", "GRANT", "REVOKE", "EXEC", "EXECUTE", "--", ";"
    );

    public boolean isConsultaSegura(String sql) {
        if (sql == null || sql.isBlank()) {
            return false;
        }

        String sqlUpperCase = sql.toUpperCase();

        // Precisa começar com SELECT — qualquer outra coisa já é suspeito
        if (!sqlUpperCase.trim().startsWith("SELECT")) {
            return false;
        }

        // Verifica se contém qualquer palavra-chave perigosa em qualquer lugar da query
        for (String palavra : PALAVRAS_BLOQUEADAS) {
            if (sqlUpperCase.contains(palavra)) {
                return false;
            }
        }

        return true;
    }
}