import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AppShell.css';

const ITENS = [
  { to: '/consulta', rotulo: 'Consulta', d: 'M4 5h16v11H9l-5 4V5z' },
  { to: '/clientes', rotulo: 'Clientes', d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
  { to: '/logs', rotulo: 'Logs de auditoria', d: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z' },
];

export default function AppShell({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function sair() {
    logout();
    navigate('/login');
  }

  return (
    <div className="sh">
      <nav className="sh-rail" aria-label="Navegação principal">
        <Link to="/" className="sh-logo" aria-label="Página de apresentação">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 3 4 6v6c0 4.5 3.2 8 8 9 4.8-1 8-4.5 8-9V6l-8-3z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </Link>
        {ITENS.map((i) => (
          <NavLink key={i.to} to={i.to} title={i.rotulo} aria-label={i.rotulo}
            className={({ isActive }) => 'sh-link' + (isActive ? ' ativo' : '')}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
              <path d={i.d} />
            </svg>
          </NavLink>
        ))}
      </nav>

      <div className="sh-main">
        <header className="sh-top">
          <button type="button" className="sh-sair" onClick={sair}>Sair</button>
        </header>
        {children}
      </div>
    </div>
  );
}
