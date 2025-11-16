import React from "react";
import { Routes, Route } from "react-router-dom";

// Importa las páginas o secciones
import Home from "./pages/Home";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import VolunteerProfile from "./pages/VolunteerProfile";
import PerfilVoluntario from "./components/PerfilVoluntario";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/volunteer_dashboard" element={<VolunteerProfile />} />
      <Route path="/perfil_voluntario" element={<PerfilVoluntario />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
