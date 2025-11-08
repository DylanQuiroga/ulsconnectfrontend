import React from "react";
import { Routes, Route } from "react-router-dom";

// Importa las páginas o secciones
import Home from "./pages/Home";
import Register from "./pages/Register";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register/>} />
    </Routes>
  );
};

export default AppRoutes;
