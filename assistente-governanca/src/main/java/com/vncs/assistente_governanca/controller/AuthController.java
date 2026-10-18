package com.vncs.assistente_governanca.controller;

import com.vncs.assistente_governanca.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        // Delega ao Spring Security a validação de email + senha
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getSenha()
                )
        );

        // Se chegou até aqui, a autenticação foi bem-sucedida (senão, uma exceção já teria sido lançada)
        String token = jwtService.gerarToken(loginRequest.getEmail());

        return ResponseEntity.ok(new LoginResponse(token));
    }

    // Classe interna para representar o corpo da requisição de login
    static class LoginRequest {
        private String email;
        private String senha;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getSenha() { return senha; }
        public void setSenha(String senha) { this.senha = senha; }
    }

    // Classe interna para representar a resposta com o token
    static class LoginResponse {
        private String token;

        public LoginResponse(String token) { this.token = token; }
        public String getToken() { return token; }
    }
}