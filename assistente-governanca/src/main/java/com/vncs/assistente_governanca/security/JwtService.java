package com.vncs.assistente_governanca.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtService {

    // Chave secreta usada para assinar e validar os tokens.
    // Em produção, isso viria de uma variável de ambiente — nunca hardcoded.
    @Value("${jwt.secret}")
    private String secretKeyString;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKeyString.getBytes());
    }

    // Gera um token novo para o usuário autenticado
    public String gerarToken(String email) {
        long agora = System.currentTimeMillis();
        long expiracao = agora + 1000 * 60 * 60; // 1 hora de validade

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date(agora))
                .expiration(new Date(expiracao))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Extrai o email (subject) de dentro de um token já existente
    public String extrairEmail(String token) {
        return extrairClaim(token, Claims::getSubject);
    }

    // Verifica se o token ainda é válido (assinatura correta e não expirado)
    public boolean tokenValido(String token, String email) {
        String emailDoToken = extrairEmail(token);
        return emailDoToken.equals(email) && !tokenExpirado(token);
    }

    private boolean tokenExpirado(String token) {
        return extrairClaim(token, Claims::getExpiration).before(new Date());
    }

    private <T> T extrairClaim(String token, Function<Claims, T> resolver) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return resolver.apply(claims);
    }
}