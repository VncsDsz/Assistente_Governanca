import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import AppShell from '../components/AppShell';
import '../pages/styles/Paginas.css';

const CLIENTE_VAZIO = {
  nomeEmpresa: '',
  setorAtuacao: '',
  scoreCredito: '',
  dataCadastro: '',
};

// "2026-01-15" -> "15/01/2026" (sem usar Date, para não deslocar o dia por fuso horário)
function formatarData(iso) {
  if (!iso) return '—';
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState(CLIENTE_VAZIO);
  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (err) {
      setErro('Erro ao carregar clientes.');
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErro('');

    try {
      if (editandoId) {
        await api.put(`/clientes/${editandoId}`, formData);
      } else {
        await api.post('/clientes', formData);
      }
      setFormData(CLIENTE_VAZIO);
      setEditandoId(null);
      carregarClientes();
    } catch (err) {
      setErro('Erro ao salvar cliente.');
    }
  }

  function handleEditar(cliente) {
    setFormData({
      nomeEmpresa: cliente.nomeEmpresa ?? '',
      setorAtuacao: cliente.setorAtuacao ?? '',
      scoreCredito: cliente.scoreCredito ?? '',
      dataCadastro: cliente.dataCadastro ?? '',
    });
    setEditandoId(cliente.idCliente);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleExcluir(id) {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      await api.delete(`/clientes/${id}`);
      carregarClientes();
    } catch (err) {
      setErro('Erro ao excluir cliente.');
    }
  }

  function handleCancelarEdicao() {
    setFormData(CLIENTE_VAZIO);
    setEditandoId(null);
  }

  return (
    <AppShell>
      <div className="pg">
        <header className="pg-head">
          <div>
            <h1>Clientes</h1>
            <p>Base de empresas usada nas consultas em linguagem natural.</p>
          </div>
        </header>

        {erro && <p className="pg-erro" role="alert">{erro}</p>}

        <section className="pg-card">
          <h2>{editandoId ? 'Editar cliente' : 'Novo cliente'}</h2>
          <form className="pg-form" onSubmit={handleSubmit}>
            <label className="pg-field">
              Nome da empresa
              <input className="pg-input" name="nomeEmpresa" value={formData.nomeEmpresa} onChange={handleChange} required />
            </label>
            <label className="pg-field">
              Setor de atuação
              <input className="pg-input" name="setorAtuacao" value={formData.setorAtuacao} onChange={handleChange} />
            </label>
            <label className="pg-field">
              Score de crédito
              <input className="pg-input" name="scoreCredito" type="number" value={formData.scoreCredito} onChange={handleChange} />
            </label>
            <label className="pg-field">
              Data de cadastro
              <input className="pg-input" name="dataCadastro" type="date" value={formData.dataCadastro} onChange={handleChange} required />
            </label>

            <div className="pg-acoes">
              <button type="submit" className="pg-btn">{editandoId ? 'Salvar alterações' : 'Cadastrar'}</button>
              {editandoId && (
                <button type="button" className="pg-btn sec" onClick={handleCancelarEdicao}>Cancelar</button>
              )}
            </div>
          </form>
        </section>

        <section className="pg-card">
          {clientes.length === 0 ? (
            <p className="pg-vazio">Nenhum cliente cadastrado ainda.</p>
          ) : (
            <div className="pg-tabela">
              <table>
                <thead>
                  <tr>
                    <th>Empresa</th>
                    <th>Setor</th>
                    <th>Score</th>
                    <th>Cadastro</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((c) => (
                    <tr key={c.idCliente}>
                      <td>{c.nomeEmpresa}</td>
                      <td>{c.setorAtuacao ?? '—'}</td>
                      <td>{c.scoreCredito ?? '—'}</td>
                      <td>{formatarData(c.dataCadastro)}</td>
                      <td>
                        <div className="pg-celula-acoes">
                          <button className="pg-btn sec peq" onClick={() => handleEditar(c)} aria-label={`Editar ${c.nomeEmpresa}`}>Editar</button>
                          <button className="pg-btn perigo peq" onClick={() => handleExcluir(c.idCliente)} aria-label={`Excluir ${c.nomeEmpresa}`}>Excluir</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
