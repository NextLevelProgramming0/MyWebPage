import React, { useEffect, useState } from 'react';
import './App.css';
import Home from './Home';
import { Skills } from './Skills';
import { Projects } from './Projects';
import { Experience } from './Experience';
import { Education } from './Education';
import { ContactInfo } from './ContactInfo';
import Login from './Login';
import CompleteAuth from './CompleteAuth';
import { clearTokens, isAuthenticated } from './Auth';
import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';

function ProtectedRoute({ authenticated, children }) {
  const location = useLocation();
  return authenticated
    ? children
    : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

function PortfolioLayout({ onLogout }) {
  const navigate = useNavigate();
  const logout = () => {
    clearTokens();
    onLogout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="App Container">
      <header className="site-header">
        <h3>My Personal Portfolio</h3>
        <button type="button" className="logout-button" onClick={logout}>Log out</button>
      </header>
      <nav className="navbar navbar-expand-sm bg-light">
        <ul className="navbar-nav">
          {[
            ['/', 'Home'], ['/Skills', 'Skills'], ['/Projects', 'Projects'],
            ['/Experience', 'Experience'], ['/Education', 'Education'], ['/ContactInfo', 'Contact Info']
          ].map(([to, label]) => (
            <li className="nav-item m-1" key={to}>
              <NavLink className="btn btn-light btn-outline-primary" to={to}>{label}</NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Skills" element={<Skills />} />
        <Route path="/Projects" element={<Projects />} />
        <Route path="/Experience" element={<Experience />} />
        <Route path="/Education" element={<Education />} />
        <Route path="/ContactInfo" element={<ContactInfo />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function AppRoutes() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  useEffect(() => {
    const expire = () => {
      clearTokens();
      setAuthenticated(false);
    };
    window.addEventListener('auth-expired', expire);
    return () => window.removeEventListener('auth-expired', expire);
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={() => setAuthenticated(true)} />} />
      <Route path="/verify-email" element={<CompleteAuth type="signup" />} />
      <Route path="/reset-password" element={<CompleteAuth type="reset" />} />
      <Route path="/*" element={
        <ProtectedRoute authenticated={authenticated}>
          <PortfolioLayout onLogout={() => setAuthenticated(false)} />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return <BrowserRouter><AppRoutes /></BrowserRouter>;
}
