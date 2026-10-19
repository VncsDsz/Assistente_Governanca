# Assistente de Governança Corporativa e Análise de Dados

Aplicação web em que usuários autenticados fazem **perguntas em linguagem natural** sobre os dados de uma empresa. Uma IA traduz a pergunta em SQL, o sistema **valida** a consulta, executa no banco e **registra tudo em um log de auditoria**.

> Estado atual: **MVP**. O fluxo completo funciona sobre uma base de exemplo. As limitações conhecidas estão listadas [mais abaixo](#limitações-conhecidas-e-próximos-passos).

## Como funciona

1. O usuário faz login e recebe um token JWT.
2. Digita uma pergunta.
3. O back-end envia ao Google Gemini **apenas a pergunta e a estrutura das tabelas**, nunca os dados, e recebe uma consulta SQL.
4. Um validador aceita somente consultas de leitura (`SELECT`) e bloqueia comandos perigosos.
5. A consulta é executada e o resultado volta em formato de tabela.
6. Pergunta, SQL gerado, usuário e status (`SUCESSO`, `ERRO_SQL` ou `BLOQUEADO`) ficam gravados na tabela de auditoria.

```
Navegador (React, porta 5173)
        │  HTTP + token JWT (cabeçalho Authorization)
        ▼
Spring Boot (porta 8080)
  ├─ JwtAuthFilter ............ valida o token
  ├─ ConsultaService .......... orquestra a consulta
  │    ├─ GeminiIntegrationService → API do Google Gemini
  │    ├─ SqlSecurityValidator ..... bloqueia comandos perigosos
  │    └─ JdbcTemplate ............. executa no MySQL
  └─ LogAuditoriaRepository ... grava o log de cada consulta
        │
        ▼
MySQL (governanca_db)
```

## Funcionalidades

- Página de apresentação, login e área autenticada.
- **Consulta por IA** com sugestões de perguntas e tabela de resultados.
- **Clientes:** cadastro, edição, exclusão e listagem.
- **Logs de auditoria:** listagem somente leitura.
- Área de envio de bases de dados: **apenas visual** por enquanto, sinalizada como "Em breve".

## Tecnologias

| Camada | Tecnologias |
|---|---|
| Back-end | Java 21+, Spring Boot 4.1, Spring Web MVC, Spring Security, Spring Data JPA (Hibernate), JdbcTemplate, JJWT, BCrypt, Lombok |
| Banco de dados | MySQL 8 |
| IA | Google Gemini API (`gemini-flash-latest`) |
| Front-end | React, Vite, React Router, Axios, Context API, CSS |

## Estrutura do repositório

```
.
├── assistente-governanca/            Back-end (Spring Boot)
│   ├── .env.example                  Modelo das variáveis de ambiente
│   └── src/main/java/com/vncs/assistente_governanca/
│       ├── config/        SecurityConfig (CORS, filtros, rotas públicas)
│       ├── controller/    Auth, Usuario, DadosCliente, LogAuditoria, Consulta
│       ├── dto/           ConsultaRequest, ConsultaResponse
│       ├── model/         Usuario, DadosCliente, LogAuditoria
│       ├── repository/    Repositórios Spring Data JPA
│       ├── security/      JwtService, JwtAuthFilter, UserDetailsService
│       └── service/       GeminiIntegrationService, ConsultaService, SqlSecurityValidator
├── assistente-governanca-frontend/   Front-end (React + Vite)
│   └── src/  api, context, components, pages, styles
└── docs/
    └── dados-exemplo.sql             Usuário de demonstração e dados de exemplo
```

## Como executar

### Pré-requisitos

- Java 21 ou superior
- Node.js 20 ou superior
- MySQL 8 em execução
- Uma chave da API do Gemini, gerada gratuitamente no [Google AI Studio](https://aistudio.google.com/)

### 1. Banco de dados

```sql
CREATE DATABASE governanca_db;
```

As tabelas principais são criadas automaticamente pelo Hibernate na primeira execução.

### 2. Variáveis de ambiente

Na pasta `assistente-governanca/`, copie `.env.example` para `.env` e preencha:

```
DB_USER=root
DB_PASSWORD=sua_senha_do_mysql
GEMINI_API_KEY=sua_chave_do_gemini
JWT_SECRET=um_segredo_com_no_minimo_32_caracteres
```

O arquivo `.env` está no `.gitignore` e **nunca deve ser enviado ao repositório**. Para gerar um bom segredo JWT: `openssl rand -base64 48`.

### 3. Back-end

```bash
cd assistente-governanca
./mvnw spring-boot:run          # no Windows: mvnw.cmd spring-boot:run
```

A API sobe em `http://localhost:8080`.

### 4. Dados de exemplo

Com o back-end já iniciado (as tabelas existem), execute **uma única vez** o script [`docs/dados-exemplo.sql`](docs/dados-exemplo.sql) no MySQL. Ele cria:

- um usuário de demonstração, `admin@demo.com` com senha `123456` (**somente para uso local**);
- a tabela `chamados_suporte`;
- clientes e chamados fictícios para as consultas.

### 5. Front-end

```bash
cd assistente-governanca-frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`. O front-end espera a API em `http://localhost:8080` (configurado em `src/api/axiosConfig.js`).

## API

Todas as rotas, exceto `/auth/**`, exigem o cabeçalho `Authorization: Bearer <token>`.

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/login` | Recebe `{ "email", "senha" }` e devolve `{ "token" }` |
| POST | `/consulta` | Recebe `{ "pergunta" }` e devolve pergunta, SQL gerado, resultado e status |
| GET, POST | `/clientes` | Lista e cadastra clientes |
| GET, PUT, DELETE | `/clientes/{id}` | Consulta, edita e exclui um cliente |
| GET, POST | `/usuarios` | Lista e cadastra usuários |
| GET, PUT, DELETE | `/usuarios/{id}` | Consulta, edita e exclui um usuário |
| GET, POST | `/logs` | Lista e registra logs de auditoria |
| GET | `/logs/{id}` | Consulta um log |

Não há rotas de edição ou exclusão para os logs: o histórico é *append-only* por desenho.

## Segurança

- Senhas armazenadas com **BCrypt**.
- Autenticação **stateless** com JWT de 1 hora. CSRF desabilitado por esse motivo.
- **CORS** restrito à origem `http://localhost:5173`.
- Segredos (banco, chave do Gemini, segredo JWT) lidos de **variáveis de ambiente**.
- Validador de SQL aceita só `SELECT` e bloqueia `UPDATE`, `DELETE`, `DROP`, `INSERT`, `ALTER`, `TRUNCATE`, `CREATE`, `GRANT`, `REVOKE`, `EXEC`, `EXECUTE`, comentários (`--`) e ponto e vírgula.
- Nenhum dado de cliente é enviado à IA, somente a pergunta e o esquema das tabelas.
- Toda consulta é auditada, inclusive as bloqueadas e as que falharam.

## Limitações conhecidas e próximos passos

Este é um MVP. Os pontos abaixo são conhecidos e fazem parte do plano de evolução:

- **Envio de bases de dados:** a interface existe, mas o back-end ainda não recebe arquivos. Hoje o sistema consulta duas tabelas fixas, cujo esquema está descrito no prompt da IA.
- **Validador de SQL:** funciona por lista de palavras bloqueadas e não restringe quais tabelas podem ser lidas. Próximo passo: lista de tabelas permitidas, um parser SQL (como JSqlParser) e um usuário MySQL com permissão somente de leitura para as consultas da IA.
- **Controle de acesso por perfil:** o campo `papel` existe, mas qualquer usuário autenticado acessa todas as rotas.
- **API de usuários:** devolve o hash da senha na resposta. Deve passar a usar DTOs.
- **Rota `POST /logs`:** está exposta a usuários autenticados. Deve ser restrita ao uso interno.
- **Transporte:** HTTP sem TLS e sem autenticação multifator (MFA).
- **Resiliência da IA:** sem tentativas automáticas em caso de erro 503 do Gemini.
- **Testes:** ainda não há testes automatizados.

## Solução de problemas

| Sintoma | Causa provável |
|---|---|
| `Connection refused` ao subir o back-end | MySQL parado ou em outra porta |
| `Unknown database 'governanca_db'` | O banco ainda não foi criado |
| `Access denied for user` | `DB_PASSWORD` incorreta ou arquivo `.env` não encontrado |
| `403` no front-end | Token expirado (1 hora) ou ausente: faça login novamente |
| Consulta retorna `ERRO_SQL` | Tabela `chamados_suporte` não existe: execute `docs/dados-exemplo.sql` |
| `503` na consulta | Alta demanda no Gemini: tente novamente em instantes |

## Autor

**Vinicius** · [GitHub](https://github.com/VncsDsz) · [ViniciusDSS2004@gmail.com](mailto:ViniciusDSS2004@gmail.com)

<img width="1534" height="862" alt="image" src="https://github.com/user-attachments/assets/631ed9a8-6a0f-4ad5-aa71-8e6c13ebb47c" />

<img width="1534" height="862" alt="image" src="https://github.com/user-attachments/assets/6834fcf9-df24-40a2-ba17-8ffd6e15d8e8" />

