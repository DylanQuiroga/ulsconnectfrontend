import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuthStore } from "../stores/sessionStore";
import "./css/VolunteerSection.css";

interface PanelData {
  summary: {
    totalEnrollments: number;
    upcomingEnrollments: number;
    totalAttendances: number;
  };
  upcoming: Array<{
    enrollmentId: string;
    activityTitle: string;
    activityType: string;
    area: string;
    location: {
      nombreComuna: string;
      nombreLugar: string;
      lng: number;
    } | null;
    startDate: string | null;
    endDate: string | null;
    enrollmentStatus: string;
  }>;
  enrollments: Array<{
    enrollmentId: string;
    activityTitle: string;
    enrollmentStatus: string;
    attendanceCount: number;
    lastAttendanceAt: string | null;
  }>;
}

const VolunteerProfile: React.FC = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState<PanelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPanel = async () => {
      try {
        const res = await api.get('/volunteer/panel');
        if (res.data.success) {
          setData(res.data.panel);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar el panel');
      } finally {
        setLoading(false);
      }
    };
    fetchPanel();
  }, []);

  if (loading) return <div className="volunteer-dashboard"><p>Cargando...</p></div>;
  if (error) return <div className="volunteer-dashboard"><p className="error">{error}</p></div>;
  if (!data) return null;

  return (
    <section className="volunteer-dashboard">
      <h1 className="dashboard-title">¡Hola, {user?.nombre || 'Voluntario'}!</h1>

      <div className="dashboard-stats">
        <div className="stat-card">
          <p>Total Inscripciones</p>
          <h2>{data.summary.totalEnrollments}</h2>
        </div>
        <div className="stat-card">
          <p>Próximas Actividades</p>
          <h2>{data.summary.upcomingEnrollments}</h2>
        </div>
        <div className="stat-card">
          <p>Total Asistencias</p>
          <h2>{data.summary.totalAttendances}</h2>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Mis Próximas Iniciativas</h2>
        <div className="initiative-list">
          {data.upcoming.length === 0 ? (
            <p>No tienes actividades próximas</p>
          ) : (
            data.upcoming.map((item) => (
              <div key={item.enrollmentId} className="initiative-card">
                <h3>{item.activityTitle}</h3>
                <p><strong>Tipo:</strong> {item.activityType}</p>
                <p><strong>Área:</strong> {item.area}</p>
                {item.location && (
                  <p><strong>Ubicación:</strong> {item.location.nombreLugar}, {item.location.nombreComuna}</p>
                )}
                {item.startDate && (
                  <p><strong>Inicio:</strong> {new Date(item.startDate).toLocaleDateString()}</p>
                )}
                <p><strong>Estado:</strong> {item.enrollmentStatus}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Historial de Actividades</h2>
        <table className="activity-table">
          <thead>
            <tr>
              <th>Iniciativa</th>
              <th>Estado</th>
              <th>Asistencias</th>
              <th>Última Asistencia</th>
            </tr>
          </thead>
          <tbody>
            {data.enrollments.map((enroll) => (
              <tr key={enroll.enrollmentId}>
                <td>{enroll.activityTitle}</td>
                <td>{enroll.enrollmentStatus}</td>
                <td>{enroll.attendanceCount}</td>
                <td>
                  {enroll.lastAttendanceAt
                    ? new Date(enroll.lastAttendanceAt).toLocaleDateString()
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default VolunteerProfile;
