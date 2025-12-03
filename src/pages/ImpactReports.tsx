import React, { useEffect, useState } from 'react';
import { adminService, ImpactReport } from '../services/adminService';
import { FaFileDownload, FaClock, FaUsers, FaChartLine } from 'react-icons/fa';
import './css/ImpactReports.css';

const ImpactReports: React.FC = () => {
    const [reports, setReports] = useState<ImpactReport[]>([]);
    const [totals, setTotals] = useState({ totalHours: 0, totalBeneficiaries: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllImpactReports();

            if (response.success) {
                setReports(response.reports || []);
                if (response.totals) {
                    setTotals({
                        totalHours: response.totals.totalHoras || 0,
                        totalBeneficiaries: response.totals.totalBeneficiarios || 0
                    });
                }
            } else {
                setError('Error al cargar los datos del servidor.');
            }
        } catch (err) {
            console.error('Error fetching impact reports:', err);
            setError('No se pudieron cargar los reportes de impacto.');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const blob = await adminService.exportImpactReports();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `reporte-impacto-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Error exporting reports:', err);
            alert('Error al exportar los reportes.');
        }
    };

    if (loading) {
        return (
            <>
                <div className="loading-container">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-3">Cargando métricas de impacto...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="impact-container">
                <div className="impact-header">
                    <div>
                        <h1><FaChartLine style={{ marginRight: '12px' }} />Reportes de Impacto</h1>
                        <p className="impact-subtitle">Métricas y estadísticas de las actividades de voluntariado</p>
                    </div>
                    <button onClick={handleExport} className="export-btn">
                        <FaFileDownload /> Exportar CSV
                    </button>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="impact-stats">
                    <div className="impact-stat-card">
                        <div className="stat-icon hours">
                            <FaClock />
                        </div>
                        <div className="stat-content">
                            <span className="stat-label">Total Horas Voluntariado</span>
                            <span className="stat-value">{totals.totalHours}</span>
                        </div>
                    </div>
                    <div className="impact-stat-card">
                        <div className="stat-icon beneficiaries">
                            <FaUsers />
                        </div>
                        <div className="stat-content">
                            <span className="stat-label">Beneficiarios Alcanzados</span>
                            <span className="stat-value">{totals.totalBeneficiaries}</span>
                        </div>
                    </div>
                </div>

                <div className="impact-table-container">
                    <table className="impact-table">
                        <thead>
                            <tr>
                                <th>Actividad</th>
                                <th>Fecha</th>
                                <th>Ubicación</th>
                                <th>Horas Totales</th>
                                <th>Beneficiarios</th>
                                <th>Voluntarios</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.length > 0 ? (
                                reports.map((report) => (
                                    <tr key={report._id}>
                                        <td>
                                            <div className="activity-info">
                                                <span className="activity-title">{report.actividad?.titulo || 'Actividad eliminada'}</span>
                                                <span className="activity-meta">{report.actividad?.tipo || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td>{report.actividad?.fechaInicio ? new Date(report.actividad.fechaInicio).toLocaleDateString() : 'N/A'}</td>
                                        <td>{report.actividad?.area || 'N/A'}</td>
                                        <td>
                                            <span className="metric-badge hours">
                                                {report.metricas.horasTotales} hrs
                                            </span>
                                        </td>
                                        <td>
                                            <span className="metric-badge beneficiaries">
                                                {report.metricas.beneficiarios || 0}
                                            </span>
                                        </td>
                                        <td>{report.metricas.voluntariosAsistieron} / {report.actividad?.capacidad ?? report.metricas.voluntariosConfirmados}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-4">
                                        No hay reportes de impacto disponibles.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ImpactReports;
