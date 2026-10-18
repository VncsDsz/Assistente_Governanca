import { useState, useRef, useEffect } from 'react';
import api from '../api/axiosConfig';
import AppShell from '../components/AppShell';
import '../pages/styles/Consulta.css';
import iconeImg from '../assets/icon.png';

const SUGESTOES = [
  { tag: 'Clientes', texto: 'Quais clientes têm score de crédito acima de 700?' },
  { tag: 'Chamados', texto: 'Quantos chamados estão abertos?' },
  { tag: 'Atendimento', texto: 'Qual o tempo médio de resolução dos chamados?' },
];

const STATUS = {
  SUCESSO: { rotulo: 'Sucesso', cls: 'ok' },
  BLOQUEADO: { rotulo: 'Bloqueada por segurança', cls: 'bloq' },
  ERRO_SQL: { rotulo: 'Erro ao executar', cls: 'erro' },
};

function formatarTamanho(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function Consulta() {
  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [arquivos, setArquivos] = useState([]);
  const [arrastando, setArrastando] = useState(false);
  const campo = useRef(null);

  // Faz a caixa de texto crescer conforme o usuário digita (até 200px)
  useEffect(() => {
    const el = campo.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [pergunta]);

  async function enviar(event) {
    event.preventDefault();
    const texto = pergunta.trim();
    if (!texto || carregando) return;

    setErro('');
    setResposta(null);
    setCarregando(true);
    setPergunta('');

    try {
      const response = await api.post('/consulta', { pergunta: texto });
      setResposta(response.data);
    } catch (err) {
      setErro('Não foi possível processar sua pergunta. Tente novamente.');
      setPergunta(texto); // devolve o texto para o usuário não perder o que digitou
    } finally {
      setCarregando(false);
    }
  }

  // Enter envia; Shift+Enter quebra linha; ignora Enter usado para confirmar acentos/IME
  function aoTeclar(event) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.currentTarget.form.requestSubmit();
    }
  }

  function usarSugestao(texto) {
    setPergunta(texto);
    campo.current?.focus();
  }

  // Upload apenas visual: lista os arquivos escolhidos, sem enviar nada ao servidor
  function adicionarArquivos(lista) {
    setArquivos((prev) => [...prev, ...Array.from(lista)]);
  }

  function aoSoltar(event) {
    event.preventDefault();
    setArrastando(false);
    adicionarArquivos(event.dataTransfer.files);
  }

  const status = resposta ? STATUS[resposta.status] ?? { rotulo: resposta.status, cls: 'erro' } : null;

  return (
    <AppShell>
      <div className={'cs' + (resposta ? ' com-resposta' : '')}>
        <aside
          className={'cs-up' + (arrastando ? ' arrastando' : '')}
          onDragOver={(e) => { e.preventDefault(); setArrastando(true); }}
          onDragLeave={() => setArrastando(false)}
          onDrop={aoSoltar}
        >
          <span className="cs-soon">Em breve</span>
          <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 18a4 4 0 0 1-.7-7.94A6 6 0 0 1 17.9 9.2 4.5 4.5 0 0 1 17.5 18" />
            <path d="M12 20v-8m-3 3 3-3 3 3" />
          </svg>
          <h2>Base de dados da empresa</h2>
          <p>Arraste seus arquivos aqui ou selecione do computador. CSV, XLSX, JSON ou SQL.</p>
          <label className="cs-up-btn">
            Selecionar arquivos
            <input type="file" multiple accept=".csv,.xlsx,.xls,.json,.sql" className="cs-sr"
              onChange={(e) => { adicionarArquivos(e.target.files); e.target.value = ''; }} />
          </label>

          {arquivos.length > 0 && (
            <>
              <ul className="cs-lista">
                {arquivos.map((f, i) => (
                  <li key={`${f.name}-${i}`}>
                    <span className="cs-nome">{f.name}</span>
                    <small>{formatarTamanho(f.size)}</small>
                    <button type="button" aria-label={`Remover ${f.name}`}
                      onClick={() => setArquivos((prev) => prev.filter((_, idx) => idx !== i))}>✕</button>
                  </li>
                ))}
              </ul>
              <p className="cs-nota">O envio ainda não está ativo: nenhum arquivo é transmitido.</p>
            </>
          )}
        </aside>

        <section className="cs-centro">
          <img src={iconeImg} alt="" className="cs-icone" />
          <h1 className="cs-titulo">Por onde começamos?</h1>

          <form className="cs-caixa" onSubmit={enviar}>
            <label className="cs-sr" htmlFor="pergunta">Pergunta</label>
            <textarea
              id="pergunta"
              ref={campo}
              rows={1}
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              onKeyDown={aoTeclar}
              placeholder="Ex: Quais clientes têm score de crédito acima de 700?"
              disabled={carregando}
            />
            <div className="cs-rodape">
              <span className="cs-dica" aria-live="polite">
                {carregando && 'Consultando...'}
              </span>
              <button type="submit" className="cs-enviar" disabled={!pergunta.trim() || carregando} aria-label="Enviar pergunta" title="Enviar">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </button>
            </div>
          </form>

          {erro && <p className="cs-erro" role="alert">{erro}</p>}

          {!resposta && !carregando && (
            <div className="cs-sugs">
              {SUGESTOES.map((s) => (
                <button key={s.texto} type="button" className="cs-sug" onClick={() => usarSugestao(s.texto)}>
                  <small>{s.tag}</small>
                  <span>{s.texto}</span>
                </button>
              ))}
            </div>
          )}

          {resposta && (
            <article className="cs-res">
              <p className="cs-res-q"><strong>Pergunta:</strong> {resposta.perguntaOriginal}</p>
              <code className="cs-sql">{resposta.queryGerada}</code>
              <span className={`cs-badge ${status.cls}`}>{status.rotulo}</span>
              {resposta.status === 'SUCESSO' && <ResultadoTabela dados={resposta.resultado} />}
            </article>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function ResultadoTabela({ dados }) {
  if (!dados || dados.length === 0) return <p className="cs-vazio">Nenhum resultado encontrado.</p>;
  const colunas = Object.keys(dados[0]);

  return (
    <div className="cs-tabela">
      <table>
        <thead>
          <tr>{colunas.map((c) => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {dados.map((linha, i) => (
            <tr key={i}>{colunas.map((c) => <td key={c}>{String(linha[c] ?? '—')}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
