interface AttendanceTableProps {
    attendance: Array<{
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
    topActivities: Array<{
        activityId: string;
        activityTitle: string;
        area: string;
        tipo: string;
        total: number;
    }>;
}

export default function AttendanceTable({ attendance, topActivities }: AttendanceTableProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-CL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="attendance-container">
            {/* Top Actividades */}
            <div className="top-activities">
                <h4>Top 5 Actividades con Más Asistencias</h4>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Actividad</th>
                            <th>Área</th>
                            <th>Tipo</th>
                            <th>Total Asistencias</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topActivities.map((activity) => (
                            <tr key={activity.activityId}>
                                <td>{activity.activityTitle}</td>
                                <td>{activity.area}</td>
                                <td>{activity.tipo}</td>
                                <td className="text-center">{activity.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Últimas Asistencias */}
            <div className="recent-attendance">
                <h4>Últimos 20 Registros de Asistencia</h4>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Actividad</th>
                            <th>Usuario</th>
                            <th>Correo</th>
                            <th>Evento</th>
                            <th>Registrado Por</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.map((record) => {
                            // Debug para ver qué está llegando realmente
                            console.log('Registro de asistencia:', record);

                            // Helper para obtener datos de forma segura, soportando diferentes estructuras
                            // A veces userId viene poblado con el objeto del usuario
                            const userObj = (record as any).userId || (record as any).usuario || (record as any).user;
                            
                            const userName = record.userName || 
                                           userObj?.nombre || 
                                           userObj?.name || 
                                           'Sin nombre';
                                           
                            const userEmail = record.userEmail || 
                                            userObj?.correoUniversitario || 
                                            userObj?.email || 
                                            userObj?.correo ||
                                            'Sin correo';

                            const eventoNombre = record.evento || 
                                               (record as any).actividad?.titulo || 
                                               (record as any).activityId?.titulo || 
                                               '-';

                            return (
                                <tr key={record.attendanceId}>
                                    <td>{formatDate(record.recordedAt)}</td>
                                    <td>{record.activityTitle}</td>
                                    <td>{userName}</td>
                                    <td>{userEmail}</td>
                                    <td>{eventoNombre}</td>
                                    <td>{record.recordedByName}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}