import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../pages/styles/Login.css';

const MARCA = 'Assistente de Governança';

function IconeEmail() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </svg>
  );
}

function IconeSenha() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await login(email, senha);
      navigate('/consulta');
    } catch (err) {
      setErro('Email ou senha inválidos.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="lg">
      <div className="lg-card">
        <section className="lg-brand">
          <div className="lg-brand-texto">
            <h1>{MARCA}</h1>
            <p>Perguntas em linguagem natural, respostas seguras e auditadas.</p>
            <Link to="/" className="lg-brand-link">Conhecer o sistema</Link>
          </div>
        </section>

        <main className="lg-form-area">
          <form className="lg-form" onSubmit={handleSubmit}>
            <h2>Bem-vindo de volta</h2>
            <p className="lg-sub">Entre com suas credenciais para continuar.</p>

            <label className="lg-campo">
              <span className="lg-sr">Email</span>
              <IconeEmail />
              <input
                type="email"
                placeholder="Email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="lg-campo">
              <span className="lg-sr">Senha</span>
              <IconeSenha />
              <input
                type="password"
                placeholder="Senha"
                autoComplete="current-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </label>

            {erro && <p className="lg-erro" role="alert">{erro}</p>}

            <button type="submit" className="lg-botao" disabled={carregando}>
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
