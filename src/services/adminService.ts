import api from './api';

// ============== INTERFACES ==============

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
        leaderboard: LeaderboardEntry[];
    };
}

export interface RegistrationRequest {
    _id: string;
    correoUniversitario: string;
    nombre: string;
    telefono?: string;
    carrera?: string;
    intereses?: string[];
    comuna?: string;
    direccion?: string;
    edad?: number;
    statusUsuario?: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    reviewedBy?: string;
    reviewedAt?: string;
    reviewNotes?: string;
}

export interface Usuario {
    _id?: string;  // Mantener por compatibilidad
    id?: string;   // El backend devuelve 'id'
    nombre: string;
    correoUniversitario: string;
    correoPersonal?: string;
    telefono?: string;
    carrera?: string;
    status: string;
    rol: string;
    rut?: string;
    intereses?: string[];
    comuna?: string;
    direccion?: string;
    edad?: number;
    bloqueado?: boolean;
    createdAt?: string;
    creadoEn?: string;
}

export interface VolunteerScore {
    odooId: string;
    odooUrl: string | null;
    puntaje: number;
    ultimaModificacion: string | null;
    historial: Array<{
        fecha: string;
        puntos: number;
        motivo: string;
        admin: string;
    }>;
}

export interface LeaderboardEntry {
    odooId: string;
    odooUrl: string | null;
    odooRank: number | null;
    localRank: number;
    userId: string;
    nombre: string;
    correo: string;
    carrera: string;
    puntaje: number;
    totalAttendances: number;
    totalEnrollments: number;
}

export interface ImpactReport {
    _id: string;
    idActividad: string;
    metricas: {
        voluntariosInvitados: number;
        voluntariosConfirmados: number;
        voluntariosAsistieron: number;
        horasTotales: number;
        beneficiarios?: number;
        notas?: string;
    };
    creadoPor: string;
    creadoEn: string;
}

export interface AttendanceRecord {
    _id: string;
    actividad: string;
    inscripciones: Array<{
        usuario: string;
        asistencia: 'presente' | 'ausente' | 'justificada';
    }>;
    fecha: string;
    registradoPor: string;
}

export interface CreateUserData {
    correoUniversitario: string;
    nombre: string;
    contrasena: string;
    rol: 'staff' | 'admin';
    telefono?: string;
    carrera?: string;
}

// ============== ADMIN SERVICE ==============

export const adminService = {
    // ============== PANEL ==============
    async getPanelData(): Promise<AdminPanelData> {
        const response = await api.get('/admin/panel');
        return response.data;
    },

    // ============== EXPORTACIONES ==============
    async exportEnrollments(filters?: { estado?: string; actividadId?: string }): Promise<Blob> {
        const params = new URLSearchParams();
        if (filters?.estado) params.append('estado', filters.estado);
        if (filters?.actividadId) params.append('actividadId', filters.actividadId);

        const response = await api.get(`/admin/panel/export/enrollments?${params.toString()}`, {
            responseType: 'blob'
        });
        return response.data;
    },

    async exportAttendance(filters?: { actividadId?: string; usuarioId?: string }): Promise<Blob> {
        const params = new URLSearchParams();
        if (filters?.actividadId) params.append('actividadId', filters.actividadId);
        if (filters?.usuarioId) params.append('usuarioId', filters.usuarioId);

        const response = await api.get(`/admin/panel/export/attendance?${params.toString()}`, {
            responseType: 'blob'
        });
        return response.data;
    },

    // ============== SOLICITUDES DE REGISTRO ==============
    async getRegistrationRequests(status?: 'pending' | 'approved' | 'rejected'): Promise<RegistrationRequest[]> {
        const params = status ? `?status=${status}` : '';
        const response = await api.get(`/auth/registration/requests${params}`);
        // El backend puede devolver { requests: [...] } o directamente [...]
        const data = response.data;
        console.log('📋 Registration requests response:', data);
        if (Array.isArray(data)) return data;
        if (data.requests && Array.isArray(data.requests)) return data.requests;
        return [];
    },

    async approveRegistration(requestId: string): Promise<{ success: boolean; message: string }> {
        const response = await api.post(`/auth/registration/requests/${requestId}/approve`);
        return response.data;
    },

    async rejectRegistration(requestId: string, notes?: string): Promise<{ success: boolean; message: string }> {
        const response = await api.post(`/auth/registration/requests/${requestId}/reject`, { notes });
        return response.data;
    },

    // ============== GESTIÓN DE USUARIOS ==============
    async getUsers(filters?: { search?: string; role?: string; blocked?: boolean }): Promise<Usuario[]> {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.role) params.append('role', filters.role);
        if (filters?.blocked !== undefined) params.append('blocked', String(filters.blocked));

        const response = await api.get(`/admin/users?${params.toString()}`);
        const data = response.data;

        // Debug: ver qué devuelve el backend
        console.log('👥 Users response:', data);

        // El backend devuelve { success: true, total: X, usuarios: [...] }
        if (Array.isArray(data)) return data;
        if (data.usuarios && Array.isArray(data.usuarios)) return data.usuarios;
        if (data.users && Array.isArray(data.users)) return data.users;
        return [];
    },

    async updateUserRole(userId: string, role: 'estudiante' | 'staff' | 'admin'): Promise<{ success: boolean; message: string }> {
        const response = await api.patch(`/admin/users/${userId}/role`, { role });
        return response.data;
    },

    async toggleUserBlock(userId: string, blocked: boolean): Promise<{ success: boolean; message: string }> {
        const response = await api.patch(`/admin/users/${userId}/block`, { blocked });
        return response.data;
    },

    // ============== CREAR STAFF/ADMIN ==============
    async createStaffOrAdmin(data: CreateUserData): Promise<{ success: boolean; message: string; usuario?: Usuario }> {
        const response = await api.post('/admin/users/create', data);
        return response.data;
    },

    // ============== SISTEMA DE PUNTUACIÓN ==============
    async getVolunteerScore(userId: string): Promise<VolunteerScore> {
        const response = await api.get(`/admin/volunteers/${userId}/score`);
        return response.data;
    },

    async adjustVolunteerScore(userId: string, puntos: number, motivo: string): Promise<{ success: boolean; nuevoTotal: number }> {
        const response = await api.post(`/admin/volunteers/${userId}/score`, { puntos, motivo });
        return response.data;
    },

    async getLeaderboard(limit?: number): Promise<LeaderboardEntry[]> {
        const params = limit ? `?limit=${limit}` : '';
        const response = await api.get(`/admin/volunteers/leaderboard${params}`);
        const data = response.data;
        if (Array.isArray(data)) return data;
        if (data.leaderboard && Array.isArray(data.leaderboard)) return data.leaderboard;
        return [];
    },

    // ============== REPORTES DE IMPACTO ==============
    async createImpactReport(actividadId: string, metricas: {
        voluntariosInvitados: number;
        voluntariosConfirmados: number;
        voluntariosAsistieron: number;
        horasTotales: number;
        beneficiarios?: number;
        notas?: string;
    }): Promise<{ success: boolean; report: ImpactReport }> {
        const response = await api.post('/admin/impact-reports', { actividadId, metricas });
        return response.data;
    },

    async getImpactReports(): Promise<ImpactReport[]> {
        const response = await api.get('/admin/impact-reports');
        const data = response.data;
        if (Array.isArray(data)) return data;
        if (data.reports && Array.isArray(data.reports)) return data.reports;
        return [];
    },

    // ============== GESTIÓN DE ASISTENCIA ==============
    async createAttendanceList(actividadId: string): Promise<AttendanceRecord> {
        const response = await api.post('/attendance/create', { actividadId });
        return response.data.attendance || response.data;
    },

    async takeAttendance(attendanceId: string, data: {
        presentes?: string[];
        ausentes?: string[];
        justificadas?: string[];
    }): Promise<{ success: boolean }> {
        const response = await api.post('/attendance/take', { attendanceId, ...data });
        return response.data;
    },

    async updateAttendance(attendanceId: string, updates: Array<{
        usuario: string;
        asistencia: 'presente' | 'ausente' | 'justificada';
    }>): Promise<{ success: boolean }> {
        const response = await api.post('/attendance/update', { attendanceId, updates });
        return response.data;
    },

    async refreshAttendanceList(attendanceId: string): Promise<AttendanceRecord> {
        const response = await api.post('/attendance/refresh', { attendanceId });
        return response.data.attendance || response.data;
    },

    // ============== CERRAR Y PUNTUAR ACTIVIDADES ==============
    async closeActivity(actividadId: string, motivo: string): Promise<{ success: boolean }> {
        const response = await api.post(`/events/${actividadId}/close`, { motivo });
        return response.data;
    },

    async scoreActivityAttendance(actividadId: string): Promise<{ success: boolean; puntuados: number }> {
        const response = await api.post(`/events/${actividadId}/puntuar`);
        return response.data;
    }
};