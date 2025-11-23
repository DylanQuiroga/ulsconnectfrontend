import React, { useState } from "react";
import { FaTimes, FaLock } from "react-icons/fa";
import "./css/CloseActivityModal.css";
import api from "../../services/api";

interface Activity {
    _id: string;
    titulo: string;
}

interface CloseActivityModalProps {
    activity: Activity;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CloseActivityModal({ activity, onClose, onSuccess }: CloseActivityModalProps) {
    const [loading, setLoading] = useState(false);
    const [motivo, setMotivo] = useState("fecha_alcanzada");
    const [motivoPersonalizado, setMotivoPersonalizado] = useState("");

    const motivosPreestablecidos = [
        { value: "fecha_alcanzada", label: "Fecha límite alcanzada" },
        { value: "cupos_completos", label: "Cupos completos" },
        { value: "cancelacion_organizador", label: "Cancelación por organizador" },
        { value: "condiciones_climaticas", label: "Condiciones climáticas adversas" },
        { value: "otro", label: "Otro motivo" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const motivoFinal = motivo === "otro" ? motivoPersonalizado : motivo;

        if (!motivoFinal) {
            alert("Por favor, especifica el motivo de cierre");
            return;
        }

        setLoading(true);

        try {
            const res = await api.post(`/events/${activity._id}/close`, {
                motivo: motivoFinal,
            });

            if (res.data.success) {
                alert(
                    `Convocatoria cerrada correctamente. Se notificó a ${res.data.data.inscritosPendientesNotificados} usuarios.`
                );
                onSuccess();
            }
        } catch (error: any) {
            console.error("Error al cerrar convocatoria:", error);
            alert("Error: " + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content cam-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="cam-header-content">
                        <FaLock className="cam-icon" />
                        <h2>Cerrar Convocatoria</h2>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="cam-form">
                    <div className="cam-body">
                        <p className="cam-activity-name">
                            <strong>Actividad:</strong> {activity.titulo}
                        </p>

                        <div className="cam-warning">
                            <FaLock />
                            <div>
                                <strong>¿Estás seguro?</strong>
                                <p>
                                    Esta acción cerrará la convocatoria y notificará a todos los usuarios inscritos
                                    que no han sido confirmados.
                                </p>
                            </div>
                        </div>

                        <div className="cam-field">
                            <label>Motivo de cierre *</label>
                            <select
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                                required
                                className="cam-select"
                            >
                                {motivosPreestablecidos.map((m) => (
                                    <option key={m.value} value={m.value}>
                                        {m.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {motivo === "otro" && (
                            <div className="cam-field">
                                <label>Especifica el motivo *</label>
                                <textarea
                                    value={motivoPersonalizado}
                                    onChange={(e) => setMotivoPersonalizado(e.target.value)}
                                    required
                                    rows={3}
                                    placeholder="Describe el motivo de cierre..."
                                    className="cam-textarea"
                                />
                            </div>
                        )}
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
                        <button type="submit" className="am-btn am-btn-danger" disabled={loading}>
                            {loading ? "Cerrando..." : "Cerrar Convocatoria"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}