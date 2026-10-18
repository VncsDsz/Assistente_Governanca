import { Link } from 'react-router-dom';
import heroImg from '../assets/hero.jpg';
import iconeImg from '../assets/icon.png';
import '../pages/styles/Landing.css';

const MARCA = 'Assistente de Governança';
const MARCA_RODAPE = 'LyberData';
const GITHUB_URL = 'https://github.com/';
const EMAIL = 'ViniciusDSS2004@gmail.com';

const OFERTAS = [
  { titulo: 'Consulta por IA', icone: 'M13 2 4 14h7l-1 8 9-12h-7l1-8z' },
  { titulo: 'Acesso protegido', icone: 'M12 3 4 6v6c0 4.5 3.2 8 8 9 4.8-1 8-4.5 8-9V6l-8-3zM9 12l2 2 4-4' },
  { titulo: 'Auditoria completa', icone: 'M6 3h8l4 4v14H6zM14 3v4h4M9 14l2 2 4-4' },
];

const PASSOS = [
  {
    titulo: 'Pergunte',
    texto: 'Digite a pergunta como falaria com um colega. Por exemplo: O que exatamente esse número conta?',
  },
  {
    titulo: 'A IA monta a consulta',
    texto: 'Recebendo somente a pergunta e a estrutura das tabelas. Nenhum dado de cliente sai do sistema.',
  },
  {
    titulo: 'O sistema valida',
    texto: 'Só consultas de leitura passam. Comandos como UPDATE, DELETE e DROP são bloqueados antes de chegar ao banco.',
  },
  {
    titulo: 'Tudo fica registrado',
    texto: 'Pergunta, consulta gerada e resultado (sucesso, erro ou bloqueio) ficam gravados com o usuário responsável.',
  },
];

function Icone({ d }) {
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function Logo() {
  return (
    <span className="lp-logo">
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 3 4 6v6c0 4.5 3.2 8 8 9 4.8-1 8-4.5 8-9V6l-8-3z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
      {MARCA}
    </span>
  );
}

function LinkProjeto({ children }) {
  return <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">{children}</a>;
}

export default function Landing() {
  return (
    <div className="lp">
      <aside className="lp-side">
        <div className="lp-top">
          <Logo />
          <Link to="/login" className="lp-btn">Login</Link>
        </div>

        <div>
          <h1 className="lp-titulo">
            Pergunte aos seus dados <span>em linguagem natural</span>
          </h1>
          <p className="lp-sub">A IA escreve a consulta, o sistema valida e cada acesso fica registrado.</p>

          <p className="lp-rotulo">O que oferecemos</p>
          <ul className="lp-ofertas">
            {OFERTAS.map((o) => (
              <li key={o.titulo}>
                <Icone d={o.icone} />
                {o.titulo}
              </li>
            ))}
          </ul>
        </div>

        <nav className="lp-links" aria-label="Links da página">
          <a href="#como-funciona">Como funciona</a>
          <LinkProjeto>Projeto</LinkProjeto>
          <a href={`mailto:${EMAIL}`}>Contato</a>
        </nav>
      </aside>

      <main className="lp-main">
        <section className="lp-hero" style={{ backgroundImage: `url(${heroImg})` }} aria-label="Exemplo de consulta">
          <span className="lp-pill lp-pill-a"><i className="lp-i-q">?</i>Pergunta enviada</span>
          <span className="lp-pill lp-pill-b"><i className="lp-i-ok">✓</i>Consulta validada</span>
          <span className="lp-pill lp-pill-c">
            <i>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                <path d="M6 3h8l4 4v14H6zM14 3v4h4M9 13h6M9 17h6" />
              </svg>
            </i>
            Acesso registrado
          </span>

          <div className="lp-demo">
            <p className="lp-demo-q">Quais clientes têm score de crédito acima de 700?</p>
            <code>SELECT nome_empresa FROM dados_clientes WHERE score_credito &gt; 700</code>
            <div className="lp-demo-res">
              <span>Tech Solutions LTDA</span>
              <span>Status: SUCESSO</span>
            </div>
          </div>
        </section>

        <p className="lp-frase">
          Gestores obtêm respostas sem escrever SQL, e a equipe de segurança sabe quem consultou o quê.
        </p>

        <section id="como-funciona" className="lp-secao">
          <h2>Da pergunta ao resultado, com controle em cada etapa</h2>
          <p className="lp-secao-sub">Quatro passos acontecem em segundos, sempre na mesma ordem.</p>

          <div className="lp-grade">
            {PASSOS.map((p, i) => (
              <article key={p.titulo} className="lp-card">
                <span className="lp-num">{i + 1}</span>
                <h3>{p.titulo}</h3>
                <p>{p.texto}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="lp-cta">
          <h2>Faça sua primeira pergunta!</h2>
        </section>

        <footer className="lp-footer">
          <div className="lp-footer-esq">
            <Logo />
            <p className="lp-marca">{MARCA_RODAPE}</p>
          </div>
          <div className="lp-footer-dir">
            <nav aria-label="Links do rodapé">
              <LinkProjeto>Projeto</LinkProjeto>
              <a href={`mailto:${EMAIL}`}>E-mail</a>
            </nav>
            <img src={iconeImg} alt={`Logotipo ${MARCA_RODAPE}`} className="lp-icone" />
          </div>
        </footer>
      </main>
    </div>
  );
}
