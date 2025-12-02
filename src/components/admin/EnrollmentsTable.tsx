interface EnrollmentsTableProps {
    enrollments: Array<{
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
}

export default function EnrollmentsTable({ enrollments, byStatus, topActivities }: EnrollmentsTableProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-CL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            confirmed: 'Confirmado',
            pending: 'Pendiente',
            cancelled: 'Cancelado'
        };
        return labels[status] || status;
    };

    return (
        <div className="enrollments-container">
            {/* Top Actividades */}
            <div className="top-activities">
                <h4>Top 5 Actividades con Más Inscripciones</h4>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Actividad</th>
                            <th>Área</th>
                            <th>Tipo</th>
                            <th>Estado</th>
                            <th>Inscripciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topActivities.map((activity) => (
                            <tr key={activity.activityId}>
                                <td>{activity.activityTitle}</td>
                                <td>{activity.area}</td>
                                <td>{activity.tipo}</td>
                                <td>{activity.estado}</td>
                                <td className="text-center">{activity.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Últimas Inscripciones */}
            <div className="recent-enrollments">
                <h4>Últimas 10 Inscripciones</h4>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Actividad</th>
                            <th>Usuario</th>
                            <th>Correo</th>
                            <th>Rol</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrollments.map((enrollment) => (
                            <tr key={enrollment.enrollmentId}>
                                <td>{formatDate(enrollment.createdAt)}</td>
                                <td>{enrollment.activityTitle}</td>
                                <td>{enrollment.userName}</td>
                                <td>{enrollment.userEmail}</td>
                                <td>{enrollment.userRole}</td>
                                <td>
                                    <span className={`status-badge ${enrollment.status}`}>
                                        {getStatusLabel(enrollment.status)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}