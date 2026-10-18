package com.vncs.assistente_governanca.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;
import tools.jackson.databind.node.ObjectNode;

@Service
public class GeminiIntegrationService {

    @Value("${gemini.api.url}")
    private String apiUrl;

    @Value("${gemini.api.key}")
    private String apiKey;

    private final JsonMapper jsonMapper = JsonMapper.builder().build();

    public String traduzirPerguntaParaSql(String perguntaUsuario) {
        RestTemplate restTemplate = new RestTemplate();
        String urlComChave = apiUrl + "?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String promptContexto = "Você é um assistente de banco de dados. "
                + "Dado o seguinte esquema SQL: "
                + "Tabela 'dados_clientes' (id_cliente, nome_empresa, setor_atuacao, score_credito, data_cadastro), "
                + "Tabela 'chamados_suporte' (id_chamado, id_cliente, assunto_reclamacao, status, tempo_resolucao_horas, data_abertura). "
                + "Traduza a seguinte pergunta para uma query SQL válida do tipo SELECT. "
                + "Responda APENAS com o código SQL puro, sem explicações, sem markdown, sem ```sql, sem ponto e vírgula no final: "
                + perguntaUsuario;

        try {
            ObjectNode textNode = jsonMapper.createObjectNode();
            textNode.put("text", promptContexto);

            ObjectNode partsNode = jsonMapper.createObjectNode();
            partsNode.putArray("parts").add(textNode);

            ObjectNode rootNode = jsonMapper.createObjectNode();
            rootNode.putArray("contents").add(partsNode);

            String requestBody = jsonMapper.writeValueAsString(rootNode);

            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(urlComChave, request, String.class);

            return extrairTextoDaResposta(response.getBody());

        } catch (Exception e) {
            throw new RuntimeException("Erro ao contatar a API do Gemini: " + e.getMessage(), e);
        }
    }

    private String extrairTextoDaResposta(String jsonBruto) {
        JsonNode root = jsonMapper.readTree(jsonBruto);
        String texto = root
                .path("candidates").get(0)
                .path("content")
                .path("parts").get(0)
                .path("text")
                .asString();

        return texto.replace("```sql", "").replace("```", "").trim();
    }
}