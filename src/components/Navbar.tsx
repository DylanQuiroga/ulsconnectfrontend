import React, { useState, useEffect, useRef } from "react";
import "./css/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import logo_souls from "../public/logo_souls.png";
import { useAuthStore } from "../stores/sessionStore";
import { FaUser, FaChartLine, FaSignOutAlt, FaUserCircle, FaChevronDown, FaClipboardList, FaUsers, FaCalendarAlt, FaBars, FaTimes } from "react-icons/fa";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
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
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        setMobileDropdownOpen(false);
      }
    };

    if (dropdownOpen || mobileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen, mobileDropdownOpen]);

  const handleLogout = async () => {
    setDropdownOpen(false);
    setMobileDropdownOpen(false);
    await logout();
    navigate("/");
  };

  const handleMobileNavigation = (path: string) => {
    setMobileDropdownOpen(false);
    setMenuOpen(false);
    navigate(path);
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
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link></li>
          <li><Link to="/convocatorias_panel" onClick={() => setMenuOpen(false)}>Convocatorias</Link></li>
          <li><Link to="/quienes-somos" onClick={() => setMenuOpen(false)}>Quiénes Somos</Link></li>
          <li><Link to="/noticias" onClick={() => setMenuOpen(false)}>Noticias</Link></li>
          <li><Link to="/contacto" onClick={() => setMenuOpen(false)}>Contacto</Link></li>

          {/* Mobile user menu */}
          <div className="mobile-buttons">
            {user ? (
              <div className="user-menu" ref={mobileDropdownRef}>
                <button
                  className="nav-user"
                  onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                  aria-expanded={mobileDropdownOpen}
                  aria-haspopup="true"
                >
                  <FaUserCircle />
                  <span>{user.nombre || user.correoUniversitario}</span>
                  <FaChevronDown className={`chevron ${mobileDropdownOpen ? "open" : ""}`} />
                </button>

                {mobileDropdownOpen && (
                  <div className="dropdown-menu">
                    <button
                      className="dropdown-item"
                      onClick={() => handleMobileNavigation("/perfil_voluntario")}
                    >
                      <FaUser />
                      <span>Mi Perfil</span>
                    </button>

                    {isAdmin ? (
                      <>
                        <button
                          className="dropdown-item"
                          onClick={() => handleMobileNavigation("/admin/dashboard")}
                        >
                          <FaChartLine />
                          <span>Panel de Administrador</span>
                        </button>

                        <button
                          className="dropdown-item"
                          onClick={() => handleMobileNavigation("/admin/activity-management")}
                        >
                          <FaCalendarAlt />
                          <span>Gestión de Actividades</span>
                        </button>

                        <button
                          className="dropdown-item"
                          onClick={() => handleMobileNavigation("/admin/gestion-usuarios")}
                        >
                          <FaUsers />
                          <span>Gestión de Usuarios</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="dropdown-item"
                          onClick={() => handleMobileNavigation("/volunteer/panel")}
                        >
                          <FaChartLine />
                          <span>Panel de Voluntario</span>
                        </button>

                        <button
                          className="dropdown-item"
                          onClick={() => handleMobileNavigation("/mis-inscripciones")}
                        >
                          <FaClipboardList />
                          <span>Mis Inscripciones</span>
                        </button>
                      </>
                    )}

                    <div className="dropdown-divider"></div>

                    <button
                      className="dropdown-item logout"
                      onClick={() => { handleLogout(); setMenuOpen(false); }}
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
                <button className="btn-login" onClick={() => { navigate("/login"); setMenuOpen(false); }}>
                  Inicio de sesión
                </button>
                <button className="btn-register" onClick={() => { navigate("/register"); setMenuOpen(false); }}>
                  Registrarse
                </button>
              </>
            )}
          </div>
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
