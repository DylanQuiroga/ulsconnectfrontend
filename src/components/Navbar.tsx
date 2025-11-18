import React, { useState, useEffect } from "react";
import "./css/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import logo_souls from "../public/logo_souls.png";
import { useAuthStore } from "../stores/sessionStore";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  
  const { user, fetchUser, logout } = useAuthStore();

  useEffect(() => {
    // Solo fetch si no hay user en el store
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo"><img src={logo_souls} alt="logo souls" style={{ height: "50px" }} /></div>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/convocatorias_panel">Convocatorias</Link></li>
          <li><Link to="/quienes-somos">Quiénes Somos</Link></li>
          <li><Link to="/noticias">Noticias</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
        </ul>

        <div className="nav-buttons">
          {user ? (
            <>
              <button 
                className="nav-user" 
                onClick={() => navigate("/perfil_voluntario")}
                style={{ cursor: "pointer" }}
              >
                Hola, {user.nombre || user.correoUniversitario}
              </button>
              <button className="btn-logout" onClick={handleLogout}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <button className="btn-login" onClick={() => navigate("/login")}>Inicio de sesión</button>
              <button className="btn-register" onClick={() => navigate("/register")}>Registrarse</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
