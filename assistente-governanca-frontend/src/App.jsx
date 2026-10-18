import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Consulta from './pages/Consulta';
import Clientes from './pages/Clientes';
import Logs from './pages/Logs';
import Landing from './pages/Landing';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/consulta"
        element={
          <ProtectedRoute>
            <Consulta />
          </ProtectedRoute>
        }
      />

      <Route
        path="/clientes"
        element={
          <ProtectedRoute>
            <Clientes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/logs"
        element={
          <ProtectedRoute>
            <Logs />
          </ProtectedRoute>
        }
      />

      <Route 
        path="/" 
        element={
          <Landing />} 
      />
    </Routes>
  );
}

export default App;