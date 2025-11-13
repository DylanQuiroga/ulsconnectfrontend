import React, { useState, useEffect } from "react";
import "./css/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import logo_souls from "../public/logo_souls.png";
import api from "../services/api";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    api.get("/me")
      .then((res) => {
        if (!mounted) return;
        setUser(res.data?.user ?? null);
      })
      .catch(() => {
        if (!mounted) return;
        setUser(null);
      });
    return () => { mounted = false; };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
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
          <li><Link to="/convocatorias">Convocatorias</Link></li>
          <li><Link to="/quienes-somos">Quiénes Somos</Link></li>
          <li><Link to="/noticias">Noticias</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
        </ul>

        <div className="nav-buttons">
          {user ? (
            <>
              <span className="nav-user">Hola, {user.nombre || user.correoUniversitario}</span>
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
