import './App.css';
import Home from './Home';
import { Skills } from './Skills';
import { Projects } from './Projects';
import { Experience } from './Experience';
import { Education } from './Education';
import { ContactInfo } from './ContactInfo';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <div className="App Container">
        <header className="site-header"><h3>My Personal Portfolio</h3></header>
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
    </BrowserRouter>
  );
}
