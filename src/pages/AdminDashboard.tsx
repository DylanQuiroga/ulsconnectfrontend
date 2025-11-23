import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // ✅ Importar Link
import { FaCalendarAlt } from 'react-icons/fa'; // ✅ Importar icono
import { adminService, AdminPanelData } from '../services/adminService';
import SummaryCards from '../components/admin/SummaryCards';
import ActivityMetrics from '../components/admin/ActivityMetrics';
import EnrollmentsTable from '../components/admin/EnrollmentsTable';
import AttendanceTable from '../components/admin/AttendanceTable';
import ExportButtons from '../components/admin/ExportButtons';
import '../components/css/AdminDashboard.css';

export default function AdminDashboard() {
    const [data, setData] = useState<AdminPanelData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadPanelData();
    }, []);

    const loadPanelData = async () => {
        try {
            setLoading(true);
            const response = await adminService.getPanelData();
            setData(response);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar el panel');
            console.error('Error loading panel:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="admin-dashboard loading">Cargando panel...</div>;
    }

    if (error) {
        return (
            <div className="admin-dashboard error">
                <p>Error: {error}</p>
                <button onClick={loadPanelData}>Reintentar</button>
            </div>
        );
    }

    if (!data) {
        return <div className="admin-dashboard">No hay datos disponibles</div>;
    }

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>Panel de Administración</h1>
                    <p className="header-subtitle">Gestiona todas las actividades y usuarios</p>
                </div>
                <div className="header-actions">
                    {/* ✅ NUEVO: Botón para ir a gestión de actividades */}
                    <Link to="/admin/activity-management" className="btn-manage-activities">
                        <FaCalendarAlt /> Gestionar Actividades
                    </Link>
                    <ExportButtons />
                </div>
            </header>

            <SummaryCards summary={data.panel.summary} />

            <ActivityMetrics metrics={data.panel.metrics} />

            <section className="dashboard-section">
                <h2>Inscripciones Recientes</h2>
                <EnrollmentsTable
                    enrollments={data.panel.enrollments.latest}
                    byStatus={data.panel.enrollments.byStatus}
                    topActivities={data.panel.enrollments.topActivities}
                />
            </section>

            <section className="dashboard-section">
                <h2>Asistencias Recientes</h2>
                <AttendanceTable
                    attendance={data.panel.attendance.recent}
                    topActivities={data.panel.attendance.topActivities}
                />
            </section>
        </div>
    );
}