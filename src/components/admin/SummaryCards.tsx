interface SummaryCardsProps {
    summary: {
        totalActivities: number;
        activeActivities: number;
        upcomingActivities: number;
        totalEnrollments: number;
        totalAttendance: number;
    };
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
    return (
        <div className="summary-cards">
            <div className="summary-card">
                <h3>Total Actividades</h3>
                <p className="card-value">{summary.totalActivities}</p>
            </div>
            <div className="summary-card">
                <h3>Actividades Activas</h3>
                <p className="card-value">{summary.activeActivities}</p>
            </div>
            <div className="summary-card">
                <h3>Próximas Actividades</h3>
                <p className="card-value">{summary.upcomingActivities}</p>
            </div>
            <div className="summary-card">
                <h3>Total Inscripciones</h3>
                <p className="card-value">{summary.totalEnrollments}</p>
            </div>
            <div className="summary-card">
                <h3>Total Asistencias</h3>
                <p className="card-value">{summary.totalAttendance}</p>
            </div>
        </div>
    );
}