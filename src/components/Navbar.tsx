import { useState } from "react";
import "./css/Navbar.css";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo"><img src="/src/public/logo_souls.png" alt="logo souls" style={{ height: "50px" }}></img></div>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><a href="#">Inicio</a></li>
          <li><a href="#">Convocatorias</a></li>
          <li><a href="#">Quiénes Somos</a></li>
          <li><a href="#">Noticias</a></li>
          <li><a href="#">Contacto</a></li>

          <div className="mobile-buttons">
            <button className="btn-login">Inicio de sesión</button>
            <button className="btn-register">Registrarse</button>
          </div>
        </ul>

        <div className="nav-buttons">
          <button className="btn-login">Inicio de sesión</button>
          <button className="btn-register">Registrarse</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
