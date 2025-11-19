import api from './api';

export interface AdminPanelData {
    success: boolean;
    panel: {
        summary: {
            totalActivities: number;
            activeActivities: number;
            upcomingActivities: number;
            totalEnrollments: number;
            totalAttendance: number;
        };
        metrics: {
            byArea: Array<{ area: string; total: number; activas: number }>;
            byType: Array<{ tipo: string; total: number }>;
            byMonth: Array<{ bucket: string; total: number }>;
        };
        enrollments: {
            total: number;
            byStatus: {
                confirmed: number;
                pending: number;
                cancelled: number;
            };
            topActivities: Array<{
                activityId: string;
                activityTitle: string;
                area: string;
                tipo: string;
                estado: string;
                total: number;
            }>;
            latest: Array<{
                enrollmentId: string;
                status: string;
                createdAt: string;
                activityId: string;
                activityTitle: string;
                userId: string;
                userName: string;
                userEmail: string;
                userRole: string;
            }>;
        };
        attendance: {
            total: number;
            topActivities: Array<{
                activityId: string;
                activityTitle: string;
                area: string;
                tipo: string;
                total: number;
            }>;
            recent: Array<{
                attendanceId: string;
                activityId: string;
                activityTitle: string;
                userId: string;
                userName: string;
                userEmail: string;
                recordedAt: string;
                recordedBy: string;
                recordedByName: string;
                evento: string;
            }>;
        };
        exports: {
            enrollmentsCsv: string;
            attendanceCsv: string;
        };
    };
}

export const adminService = {
    // Obtener datos del panel
    async getPanelData(): Promise<AdminPanelData> {
        const response = await api.get('/admin/panel');
        return response.data;
    },

    // Exportar inscripciones
    async exportEnrollments(filters?: { estado?: string; actividadId?: string }): Promise<Blob> {
        const params = new URLSearchParams();
        if (filters?.estado) params.append('estado', filters.estado);
        if (filters?.actividadId) params.append('actividadId', filters.actividadId);

        const response = await api.get(`/admin/panel/export/enrollments?${params.toString()}`, {
            responseType: 'blob'
        });
        return response.data;
    },

    // Exportar asistencias
    async exportAttendance(filters?: { actividadId?: string; usuarioId?: string }): Promise<Blob> {
        const params = new URLSearchParams();
        if (filters?.actividadId) params.append('actividadId', filters.actividadId);
        if (filters?.usuarioId) params.append('usuarioId', filters.usuarioId);

        const response = await api.get(`/admin/panel/export/attendance?${params.toString()}`, {
            responseType: 'blob'
        });
        return response.data;
    }
};