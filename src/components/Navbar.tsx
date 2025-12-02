import React, { useState, useEffect, useRef } from "react";
import "./css/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import logo_souls from "../public/logo_souls.png";
import { useAuthStore } from "../stores/sessionStore";
import { FaUser, FaChartLine, FaSignOutAlt, FaUserCircle, FaChevronDown, FaClipboardList, FaUsers, FaCalendarAlt, FaBars, FaTimes } from "react-icons/fa";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { user, fetchUser, logout, isLoading } = useAuthStore();

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate("/");
  };

  const isAdmin = user?.role === "admin" || user?.role === "staff";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <img src={logo_souls} alt="logo souls" style={{ height: "50px" }} />
        </div>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
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
            <div className="user-menu" ref={dropdownRef}>
              <button
                className="nav-user"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <FaUserCircle />
                <span>{user.nombre || user.correoUniversitario}</span>
                <FaChevronDown className={`chevron ${dropdownOpen ? "open" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link
                    to="/perfil_voluntario"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FaUser />
                    <span>Mi Perfil</span>
                  </Link>

                  {isAdmin ? (
                    <>
                      <Link
                        to="/admin/dashboard"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FaChartLine />
                        <span>Panel de Administrador</span>
                      </Link>

                      {/* ✅ NUEVO: Gestión de Actividades */}
                      <Link
                        to="/admin/activity-management"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FaCalendarAlt />
                        <span>Gestión de Actividades</span>
                      </Link>

                      {/* ✅ NUEVO: Gestión de Usuarios */}
                      <Link
                        to="/admin/gestion-usuarios"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FaUsers />
                        <span>Gestión de Usuarios</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/volunteer/panel"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FaChartLine />
                        <span>Panel de Voluntario</span>
                      </Link>

                      <Link
                        to="/mis-inscripciones"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FaClipboardList />
                        <span>Mis Inscripciones</span>
                      </Link>
                    </>
                  )}

                  <div className="dropdown-divider"></div>

                  <button
                    className="dropdown-item logout"
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    <FaSignOutAlt />
                    <span>{isLoading ? "Cerrando..." : "Cerrar sesión"}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="btn-login" onClick={() => navigate("/login")}>
                Inicio de sesión
              </button>
              <button className="btn-register" onClick={() => navigate("/register")}>
                Registrarse
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
