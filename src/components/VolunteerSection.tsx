import React from "react";
import "./css/VolunteerSection.css";

const VolunteerProfile: React.FC = () => {

  return (
    <section className="volunteer-dashboard">
      <h1 className="dashboard-title">¡Hola, USUARIO!</h1>

      {/* Datos del usuario */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <p>Horas totales contribuidas</p>
          <h2>99</h2>
        </div>
        <div className="stat-card">
          <p>Iniciativas completadas</p>
          <h2>99</h2>
        </div>
      </div>

      {/* Próximas iniciativas */}
      <div className="dashboard-section">
        <h2>Mis Próximas Iniciativas</h2>
        <div className="initiative-list">
        </div>
      </div>

      {/* Historial de actividades */}
      <div className="dashboard-section">
        <h2>Historial de Actividades</h2>
        <table className="activity-table">
          <thead>
            <tr>
              <th>Iniciativa</th>
              <th>Organización</th>
              <th>Fecha</th>
              <th>Horas</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default VolunteerProfile;
