import React from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
// Importa las páginas o secciones
import Home from "./pages/Home";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import VolunteerProfile from "./pages/VolunteerProfile";
import PerfilVoluntario from "./components/PerfilVoluntario";
import ConvocatoriasPanel from "./components/ConvocatoriasPanel";
import MisInscripciones from "./components/MisInscripciones"; // ✅ NUEVO
import WhoWeAre from "./pages/whoweare";
import NewsSection from "./components/Noticias";
import ActivityManagement from "./pages/ActivityManagement";
import ContactForm from "./pages/ContactForm";
import Success from "./pages/Success";
import AdminDashboard from "./pages/AdminDashboard";

const AppRoutes: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ Panel del Voluntario */}
        <Route path="/volunteer/panel" element={<VolunteerProfile />} />
        <Route path="/volunteer_dashboard" element={<VolunteerProfile />} />

        {/* ✅ Perfil de usuario */}
        <Route path="/perfil_voluntario" element={<PerfilVoluntario />} />

        {/* ✅ Convocatorias */}
        <Route path="/convocatorias_panel" element={<ConvocatoriasPanel />} />

        {/* ✅ NUEVO: Mis Inscripciones */}
        <Route path="/mis-inscripciones" element={<MisInscripciones />} />

        {/* Páginas institucionales */}
        <Route path="/quienes-somos" element={<WhoWeAre />} />
        <Route path="/noticias" element={<NewsSection />} />
        <Route path="/contacto" element={<ContactForm />} />
        <Route path="/success" element={<Success />} />

        {/* ✅ Panel de Administrador */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/activity-management" element={<ActivityManagement />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
