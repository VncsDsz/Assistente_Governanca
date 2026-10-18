package com.vncs.assistente_governanca.service;

import com.vncs.assistente_governanca.model.LogAuditoria;
import com.vncs.assistente_governanca.model.Usuario;
import com.vncs.assistente_governanca.repository.LogAuditoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ConsultaService {

    @Autowired
    private GeminiIntegrationService geminiIntegrationService;

    @Autowired
    private SqlSecurityValidator sqlSecurityValidator;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private LogAuditoriaRepository logAuditoriaRepository;

    public ConsultaResultado executar(String pergunta, Usuario usuarioAutenticado) {

        String sqlGerado = geminiIntegrationService.traduzirPerguntaParaSql(pergunta);
        String status;
        List<Map<String, Object>> resultado = null;

        if (!sqlSecurityValidator.isConsultaSegura(sqlGerado)) {
            status = "BLOQUEADO";
        } else {
            try {
                resultado = jdbcTemplate.queryForList(sqlGerado);
                status = "SUCESSO";
            } catch (Exception e) {
                status = "ERRO_SQL";
            }
        }

        // Grava o log de auditoria independentemente do resultado (sucesso, erro ou bloqueio)
        LogAuditoria log = new LogAuditoria();
        log.setUsuario(usuarioAutenticado);
        log.setPerguntaOriginal(pergunta);
        log.setQueryExecutada(sqlGerado);
        log.setStatusExecucao(status);
        logAuditoriaRepository.save(log);

        return new ConsultaResultado(sqlGerado, resultado, status);
    }

    // Classe auxiliar interna para carregar os três resultados do processamento
    public record ConsultaResultado(String queryGerada, List<Map<String, Object>> resultado, String status) {}
}