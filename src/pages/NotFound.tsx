import React from "react";

const NotFound: React.FC = () => {
  return (
    <div style={{ textAlign: "center", padding: "200px", color: "#111", background: "#fff" }}>
      <h1 style={{ fontSize: "48px", color: "#111" }}>404 - Página no encontrada</h1>
      <p>La ruta que intentas visitar no existe.</p>
      <a
        href="/"
        style={{ color: "#fe6970", textDecoration: "none", fontWeight: "bold" }}
      >
        Volver al inicio
      </a>
    </div>
  );
};

export default NotFound;