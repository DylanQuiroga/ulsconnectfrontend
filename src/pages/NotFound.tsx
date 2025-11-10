import React from "react";

const NotFound: React.FC = () => {
  return (
    <div style={{ textAlign: "center", padding: "80px" }}>
      <h1>404 - Página no encontrada</h1>
      <p>La ruta que intentas visitar no existe.</p>
      <a
        href="/"
        style={{ color: "#16a34a", textDecoration: "none", fontWeight: "bold" }}
      >
        Volver al inicio
      </a>
    </div>
  );
};

export default NotFound;
