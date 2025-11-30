import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaCheck, FaTimesCircle, FaClock, FaSync } from 'react-icons/fa';
import { adminService, AttendanceRecord } from '../../services/adminService';
import './css/AttendanceModal.css';

interface AttendanceModalProps {
    activityId: string;
    activityTitle: string;
    onClose: () => void;
}

export default function AttendanceModal({ activityId, activityTitle, onClose }: AttendanceModalProps) {
    const [loading, setLoading] = useState(true);
    const [attendanceRecord, setAttendanceRecord] = useState<AttendanceRecord | null>(null);
    const [changes, setChanges] = useState<Record<string, 'presente' | 'ausente' | 'justificada'>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadAttendance();
    }, [activityId]);

    const loadAttendance = async () => {
        try {
            setLoading(true);
            const record = await adminService.createAttendanceList(activityId);
            setAttendanceRecord(record);
            
            // Initialize changes with current values
            const initialChanges: Record<string, 'presente' | 'ausente' | 'justificada'> = {};
            if (record && record.inscripciones) {
                record.inscripciones.forEach(insc => {
                    const userId = typeof insc.usuario === 'string' ? insc.usuario : insc.usuario._id;
                    initialChanges[userId] = insc.asistencia;
                });
            }
            setChanges(initialChanges);

        } catch (error) {
            console.error("Error loading attendance:", error);
            alert("Error al cargar la lista de asistencia");
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        if (!attendanceRecord) return;
        try {
            setLoading(true);
            const updated = await adminService.refreshAttendanceList(attendanceRecord._id);
            setAttendanceRecord(updated);
            
            // Re-initialize changes map to preserve unsaved changes? Or reset?
            // Resetting is safer to avoid inconsistencies.
            const initialChanges: Record<string, 'presente' | 'ausente' | 'justificada'> = {};
            if (updated && updated.inscripciones) {
                updated.inscripciones.forEach(insc => {
                    const userId = typeof insc.usuario === 'string' ? insc.usuario : insc.usuario._id;
                    initialChanges[userId] = insc.asistencia;
                });
            }
            setChanges(initialChanges);
            alert("Lista actualizada con nuevos inscritos");
        } catch (error) {
            console.error("Error refreshing attendance:", error);
            alert("Error al actualizar la lista");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (userId: string, status: 'presente' | 'ausente' | 'justificada') => {
        setChanges(prev => ({
            ...prev,
            [userId]: status
        }));
    };

    const handleSave = async () => {
        if (!attendanceRecord) return;
        
        try {
            setSaving(true);
            const updates = Object.entries(changes).map(([userId, asistencia]) => ({
                usuario: userId,
                asistencia
            }));

            if (updates.length === 0) {
                onClose();
                return;
            }

            await adminService.updateAttendance(attendanceRecord._id, updates);
            alert("Asistencia guardada correctamente");
            onClose();
        } catch (error) {
            console.error("Error saving attendance:", error);
            alert("Error al guardar la asistencia");
        } finally {
            setSaving(false);
        }
    };

    const getUserName = (user: string | { nombre: string; correoUniversitario: string }) => {
        if (typeof user === 'string') return 'Usuario ID: ' + user;
        return user.nombre;
    };

    const getUserEmail = (user: string | { nombre: string; correoUniversitario: string }) => {
        if (typeof user === 'string') return '';
        return user.correoUniversitario;
    };

    const getUserId = (user: string | { _id: string }) => {
        if (typeof user === 'string') return user;
        return user._id;
    };

    if (!loading && !attendanceRecord) return null;

    return (
        <div className="attendance-modal-overlay">
            <div className="attendance-modal">
                <div className="attendance-modal-header">
                    <div>
                        <h2>Control de Asistencia</h2>
                        <p style={{ color: '#64748b', margin: '0.5rem 0 0 0' }}>{activityTitle}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {attendanceRecord && (
                            <button 
                                className="close-btn" 
                                onClick={handleRefresh} 
                                title="Actualizar lista de inscritos"
                                style={{ color: '#3b82f6' }}
                            >
                                <FaSync />
                            </button>
                        )}
                        <button className="close-btn" onClick={onClose}>
                            <FaTimes />
                        </button>
                    </div>
                </div>

                <div className="attendance-modal-content">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Cargando lista de inscritos...</p>
                        </div>
                    ) : attendanceRecord?.inscripciones.length === 0 ? (
                        <div className="empty-state">
                            <p>No hay voluntarios inscritos en esta actividad.</p>
                        </div>
                    ) : (
                        <table className="attendance-table">
                            <thead>
                                <tr>
                                    <th>Voluntario</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceRecord?.inscripciones.map((insc, index) => {
                                    const userId = getUserId(insc.usuario);
                                    const currentStatus = changes[userId] || insc.asistencia;

                                    return (
                                        <tr key={userId || index}>
                                            <td>
                                                <div className="user-info">
                                                    <span className="user-name">{getUserName(insc.usuario)}</span>
                                                    <span className="user-email">{getUserEmail(insc.usuario)}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="status-controls">
                                                    <button
                                                        className={`status-btn presente ${currentStatus === 'presente' ? 'active' : ''}`}
                                                        onClick={() => handleStatusChange(userId, 'presente')}
                                                        title="Presente"
                                                    >
                                                        <FaCheck /> Presente
                                                    </button>
                                                    <button
                                                        className={`status-btn ausente ${currentStatus === 'ausente' ? 'active' : ''}`}
                                                        onClick={() => handleStatusChange(userId, 'ausente')}
                                                        title="Ausente"
                                                    >
                                                        <FaTimesCircle /> Ausente
                                                    </button>
                                                    <button
                                                        className={`status-btn justificada ${currentStatus === 'justificada' ? 'active' : ''}`}
                                                        onClick={() => handleStatusChange(userId, 'justificada')}
                                                        title="Justificada"
                                                    >
                                                        <FaClock /> Justificada
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="attendance-modal-footer">
                    <button className="cancel-btn" onClick={onClose} disabled={saving}>
                        Cancelar
                    </button>
                    <button 
                        className="save-btn" 
                        onClick={handleSave} 
                        disabled={saving || loading || !attendanceRecord}
                    >
                        {saving ? (
                            <>
                                <div className="spinner" style={{ width: '16px', height: '16px', borderTopColor: 'white', margin: 0 }}></div>
                                Guardando...
                            </>
                        ) : (
                            <>
                                <FaSave /> Guardar Asistencia
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
