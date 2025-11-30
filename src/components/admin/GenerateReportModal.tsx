import React, { useState } from "react";
import { FaTimes, FaChartLine, FaInfoCircle } from "react-icons/fa";
import "./css/GenerateReportModal.css";
import { adminService } from "../../services/adminService";

interface Activity {
    _id: string;
    titulo: string;
}

interface GenerateReportModalProps {
    activity: Activity;
    onClose: () => void;
    onSuccess: () => void;
}

export default function GenerateReportModal({ activity, onClose, onSuccess }: GenerateReportModalProps) {
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const [existingReportId, setExistingReportId] = useState<string | null>(null);
    const [beneficiarios, setBeneficiarios] = useState<string>("");
    const [horasTotales, setHorasTotales] = useState<string>("");
    const [notas, setNotas] = useState("");

    React.useEffect(() => {
        checkExistingReport();
    }, [activity._id]);

    const checkExistingReport = async () => {
        try {
            setChecking(true);
            // Como no tenemos un endpoint directo para buscar por actividad, traemos todos y filtramos
            // Esto no es ideal para muchos datos, pero funciona con la API actual
            const response = await adminService.getAllImpactReports();
            if (response.success && response.reports) {
                const report = response.reports.find(r => 
                    (r.actividad && r.actividad._id === activity._id) || 
                    (r.idActividad === activity._id)
                );

                if (report) {
                    setExistingReportId(report._id);
                    if (report.metricas.beneficiarios) setBeneficiarios(report.metricas.beneficiarios.toString());
                    if (report.metricas.horasTotales) setHorasTotales(report.metricas.horasTotales.toString());
                    if (report.metricas.notas) setNotas(report.metricas.notas);
                }
            }
        } catch (error) {
            console.error("Error verificando reporte existente:", error);
        } finally {
            setChecking(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);

        try {
            const beneficiariosNum = beneficiarios ? parseInt(beneficiarios) : undefined;
            const horasNum = horasTotales ? parseFloat(horasTotales) : undefined;
            
            if (existingReportId) {
                await adminService.updateImpactReport(existingReportId, {
                    beneficiarios: beneficiariosNum,
                    horasTotales: horasNum,
                    notas: notas || undefined
                });
                alert("Reporte de impacto actualizado correctamente.");
            } else {
                await adminService.createImpactReport(activity._id, {
                    beneficiarios: beneficiariosNum,
                    horasTotales: horasNum,
                    notas: notas || undefined
                });
                alert("Reporte de impacto generado correctamente.");
            }

            onSuccess();
        } catch (error: any) {
            console.error("Error al guardar reporte:", error);
            alert("Error: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (checking) {
        return (
            <div className="modal-overlay">
                <div className="modal-content grm-modal">
                    <div className="grm-loading">
                        <div className="spinner"></div>
                        <p>Verificando reportes existentes...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content grm-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="grm-header-content">
                        <FaChartLine className="grm-icon" />
                        <h2>{existingReportId ? "Editar Reporte" : "Generar Reporte"}</h2>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grm-form">
                    <div className="grm-body">
                        <p className="grm-activity-name">
                            <strong>Actividad:</strong> {activity.titulo}
                        </p>

                        <div className="grm-info">
                            <FaInfoCircle />
                            <div>
                                <strong>{existingReportId ? "Edición de Reporte" : "Generación Automática"}</strong>
                                <p>
                                    {existingReportId 
                                        ? "Puedes modificar los valores del reporte existente."
                                        : "El sistema calculará automáticamente las horas totales y voluntarios basándose en los registros de asistencia. Puedes sobrescribir estos valores si es necesario."
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="grm-field">
                            <label>Beneficiarios Directos (Opcional)</label>
                            <input
                                type="number"
                                min="0"
                                value={beneficiarios}
                                onChange={(e) => setBeneficiarios(e.target.value)}
                                placeholder="Ej: 50"
                                className="grm-input"
                            />
                            <span className="grm-help">Número estimado de personas beneficiadas por la actividad.</span>
                        </div>

                        <div className="grm-field">
                            <label>Horas Totales (Opcional)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.5"
                                value={horasTotales}
                                onChange={(e) => setHorasTotales(e.target.value)}
                                placeholder="Ej: 10.5"
                                className="grm-input"
                            />
                            <span className="grm-help">Si se deja vacío, se calculará automáticamente según la asistencia.</span>
                        </div>

                        <div className="grm-field">
                            <label>Notas Adicionales (Opcional)</label>
                            <textarea
                                value={notas}
                                onChange={(e) => setNotas(e.target.value)}
                                rows={3}
                                placeholder="Observaciones, logros destacados, etc..."
                                className="grm-textarea"
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="am-btn am-btn-outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="am-btn am-btn-primary" disabled={loading}>
                            {loading ? "Guardando..." : (existingReportId ? "Actualizar Reporte" : "Generar Reporte")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
