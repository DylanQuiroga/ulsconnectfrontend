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
          const panel = res.data.panel || {};

          // Normalizar summary
          const summary = {
            totalEnrollments:
              panel.summary?.totalEnrollments ??
              panel.summary?.totalInscripciones ??
              0,
            upcomingEnrollments:
              panel.summary?.upcomingEnrollments ??
              panel.summary?.upcomingInscripciones ??
              0,
            totalAttendances:
              panel.summary?.totalAttendances ??
              panel.summary?.totalAsistencias ??
              0,
          };

          // Normalizar upcoming (backend usa inscripcionId / activityTitle / activityType / inscripcionStatus)
          const upcoming = (panel.upcoming || []).map((it: any) => ({
            enrollmentId: it.enrollmentId ?? it.inscripcionId ?? null,
            activityTitle: it.activityTitle ?? it.titulo ?? 'Actividad no disponible',
            activityType: it.activityType ?? it.tipo ?? null,
            area: it.area ?? null,
            location: it.location ?? it.ubicacion ?? null,
            startDate: it.startDate ?? it.fechaInicio ?? null,
            endDate: it.endDate ?? it.fechaFin ?? null,
            enrollmentStatus:
              it.enrollmentStatus ?? it.inscripcionStatus ?? it.activityStatus ?? null,
          }));

          // Normalizar enrollments/historial (backend devuelve "inscripciones")
          const enrollmentsSource = panel.enrollments ?? panel.inscripciones ?? [];
          const enrollments = (enrollmentsSource || []).map((e: any) => ({
            enrollmentId: e.enrollmentId ?? e.inscripcionId ?? (e._id ? String(e._id) : null),
            activityTitle:
              e.activityTitle ??
              (e.actividad && e.actividad.titulo) ??
              (e.activity && e.activity.titulo) ??
              'Actividad no disponible',
            enrollmentStatus: e.enrollmentStatus ?? e.estado ?? e.inscripcionStatus ?? null,
            attendanceCount: typeof e.attendanceCount === 'number' ? e.attendanceCount : 0,
            lastAttendanceAt: e.lastAttendanceAt ?? null,
          }));

          setData({
            summary,
            upcoming,
            enrollments,
          });
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
