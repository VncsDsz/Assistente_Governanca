package com.vncs.assistente_governanca.controller;

import com.vncs.assistente_governanca.dto.ConsultaRequest;
import com.vncs.assistente_governanca.dto.ConsultaResponse;
import com.vncs.assistente_governanca.model.Usuario;
import com.vncs.assistente_governanca.repository.UsuarioRepository;
import com.vncs.assistente_governanca.service.ConsultaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/consulta")
public class ConsultaController {

    @Autowired
    private ConsultaService consultaService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping
    public ResponseEntity<ConsultaResponse> consultar(@RequestBody ConsultaRequest request) {

        // Extrai o email do usuário autenticado a partir do token JWT já validado pelo JwtAuthFilter
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailUsuarioLogado = authentication.getName();

        Usuario usuario = usuarioRepository.findByEmail(emailUsuarioLogado)
                .orElseThrow(() -> new RuntimeException("Usuário autenticado não encontrado no banco"));

        ConsultaService.ConsultaResultado resultado = consultaService.executar(request.getPergunta(), usuario);

        ConsultaResponse response = new ConsultaResponse(
                request.getPergunta(),
                resultado.queryGerada(),
                resultado.resultado(),
                resultado.status()
        );

        return ResponseEntity.ok(response);
    }
}