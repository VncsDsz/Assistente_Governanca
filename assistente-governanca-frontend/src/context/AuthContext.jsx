import { createContext, useContext, useState } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const isAuthenticated = !!token;

  async function login(email, senha) {
    const response = await api.post('/auth/login', { email, senha });
    const novoToken = response.data.token;

    localStorage.setItem('token', novoToken);
    setToken(novoToken);
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}