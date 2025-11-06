import React from "react";
import { Routes, Route } from "react-router-dom";

// Importa las páginas o secciones
import RegisterSection from "./components/RegisterSection";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/register" element={<RegisterSection />} />
    </Routes>
  );
};

export default AppRoutes;

