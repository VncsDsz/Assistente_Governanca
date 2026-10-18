package com.vncs.assistente_governanca.dto;

import java.util.List;
import java.util.Map;

public class ConsultaResponse {
    private String perguntaOriginal;
    private String queryGerada;
    private List<Map<String, Object>> resultado;
    private String status;

    public ConsultaResponse(String perguntaOriginal, String queryGerada, List<Map<String, Object>> resultado, String status) {
        this.perguntaOriginal = perguntaOriginal;
        this.queryGerada = queryGerada;
        this.resultado = resultado;
        this.status = status;
    }

    public String getPerguntaOriginal() { return perguntaOriginal; }
    public String getQueryGerada() { return queryGerada; }
    public List<Map<String, Object>> getResultado() { return resultado; }
    public String getStatus() { return status; }
}