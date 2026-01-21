import './App.css';
import Home from './Home';
import {Skills} from './Skills';
import {Projects} from './Projects';
import {Experience} from './Experience';
import {Education} from './Education';
import {ContactInfo} from './ContactInfo';
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
    <div className="App Container">
      <h3 className="d-flex justify-content-center m-3">
        Darius Quick's Web Page
      </h3>

      <nav className="navbar navbar-expand-sm bg-light navbar-dark">
        <ul className="navbar-nav">
          <li className="nav-item- m-1">
            <NavLink className="btn btn-light btn-outline-primary nav-btn" to="/">
            Home
            </NavLink>
          </li>
          <li className="nav-item- m-1">
            <NavLink className="btn btn-light btn-outline-primary nav-btn" to="/Skills">
            Skills
            </NavLink>
          </li>
          <li className="nav-item- m-1">
            <NavLink className="btn btn-light btn-outline-primary nav-btn" to="/Projects">
            Projects
            </NavLink>
          </li>
          <li className="nav-item- m-1">
            <NavLink className="btn btn-light btn-outline-primary nav-btn" to="/Experience">
            Experience
            </NavLink>
          </li>
          <li className="nav-item- m-1">
            <NavLink className="btn btn-light btn-outline-primary nav-btn" to="/Education">
            Education
            </NavLink>
          </li>
          <li className="nav-item- m-1">
            <NavLink className="btn btn-light btn-outline-primary nav-btn" to="/ContactInfo">
            Contact Info
            </NavLink>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/Skills' element={<Skills />} />
        <Route path='/Projects' element={<Projects />} />
        <Route path='/Experience' element={<Experience />} />
        <Route path='/Education' element={<Education />} />
        <Route path='/ContactInfo' element={<ContactInfo />} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
