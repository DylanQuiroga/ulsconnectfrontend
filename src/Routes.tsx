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
import WhoWeAre from "./pages/whoweare";
import NewsSection from "./components/Noticias";
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
        <Route path="/volunteer_dashboard" element={<VolunteerProfile />} />
        <Route path="/perfil_voluntario" element={<PerfilVoluntario />} />
        <Route path="/convocatorias_panel" element={<ConvocatoriasPanel />} />
        <Route path="/quienes-somos" element={<WhoWeAre />} />
        <Route path="/noticias" element={<NewsSection />} />
        <Route path="/contacto" element={<ContactForm />} />
        <Route path="/success" element={<Success />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
