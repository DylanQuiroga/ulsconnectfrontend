import { useState } from "react";
import "./css/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import logo_souls from "../public/logo_souls.png";


const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo"><img src={logo_souls} alt="logo souls" style={{ height: "50px" }}></img></div>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/convocatorias">Convocatorias</Link></li>
          <li><Link to="/quienes-somos">Quiénes Somos</Link></li>
          <li><Link to="/noticias">Noticias</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
        </ul>


        <div className="nav-buttons">
          <button className="btn-login" onClick={() => navigate("/login")}>Inicio de sesión</button>
          <button className="btn-register" onClick={() => navigate("/register")}>Registrarse</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
