import React from "react";
import HeroSection from "../components/HeroSection";
import VoluntariosEnAccion from "../components/VoluntariosEnAccion";
import ConvocatoriasDestacadas from "../components/ConvocatoriasDestacadas";
import SobreSouls from "../components/sobreSouls";

const Home: React.FC = () => {
  return (
    <>
      <HeroSection />
      <ConvocatoriasDestacadas />
      <VoluntariosEnAccion />
      <SobreSouls />
    </>
  );
};

export default Home;
