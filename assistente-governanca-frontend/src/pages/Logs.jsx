import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import AppShell from '../components/AppShell';
import '../pages/styles/Paginas.css';

const STATUS = {
  SUCESSO: { rotulo: 'Sucesso', cls: 'ok' },
  BLOQUEADO: { rotulo: 'Bloqueada', cls: 'bloq' },
  ERRO_SQL: { rotulo: 'Erro SQL', cls: 'erro' },
};

function formatarData(dataHora) {
  return new Date(dataHora).toLocaleString('pt-BR');
}

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarLogs();
  }, []);

  async function carregarLogs() {
    setCarregando(true);
    setErro('');

    try {
      const response = await api.get('/logs');
      setLogs(response.data);
    } catch (err) {
      setErro('Erro ao carregar logs de auditoria.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <AppShell>
      <div className="pg">
        <header className="pg-head">
          <div>
            <h1>Logs de auditoria</h1>
            <p>Histórico de todas as consultas realizadas. Os registros não podem ser editados nem excluídos.</p>
          </div>
          <button type="button" className="pg-btn sec" onClick={carregarLogs} disabled={carregando}>
            {carregando ? 'Atualizando...' : 'Atualizar'}
          </button>
        </header>

        {erro && <p className="pg-erro" role="alert">{erro}</p>}

        <section className="pg-card">
          {!carregando && logs.length === 0 && !erro && <p className="pg-vazio">Nenhum log registrado ainda.</p>}
          {carregando && logs.length === 0 && <p className="pg-vazio">Carregando...</p>}

          {logs.length > 0 && (
            <div className="pg-tabela">
              <table>
                <thead>
                  <tr>
                    <th>Data/Hora</th>
                    <th>Usuário</th>
                    <th>Pergunta</th>
                    <th>Consulta executada</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const st = STATUS[log.statusExecucao] ?? { rotulo: log.statusExecucao, cls: 'erro' };
                    return (
                      <tr key={log.idLog}>
                        <td>{formatarData(log.dataHora)}</td>
                        <td>{log.usuario?.nome ?? '—'}</td>
                        <td>{log.perguntaOriginal}</td>
                        <td className="pg-mono">{log.queryExecutada}</td>
                        <td><span className={`pg-badge ${st.cls}`}>{st.rotulo}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
