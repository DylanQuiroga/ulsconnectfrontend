interface ActivityMetricsProps {
    metrics: {
        byArea: Array<{ area: string; total: number; activas: number }>;
        byType: Array<{ tipo: string; total: number }>;
        byMonth: Array<{ bucket: string; total: number }>;
    };
}

export default function ActivityMetrics({ metrics }: ActivityMetricsProps) {
    return (
        <div className="activity-metrics">
            <div className="metrics-section">
                <h3>Actividades por Área</h3>
                <div className="metrics-list">
                    {metrics.byArea.map((item, index) => (
                        <div key={index} className="metric-item">
                            <span className="metric-label">{item.area}</span>
                            <div className="metric-values">
                                <span className="metric-total">Total: {item.total}</span>
                                <span className="metric-active">Activas: {item.activas}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="metrics-section">
                <h3>Actividades por Tipo</h3>
                <div className="metrics-list">
                    {metrics.byType.map((item, index) => (
                        <div key={index} className="metric-item">
                            <span className="metric-label">{item.tipo}</span>
                            <span className="metric-total">{item.total}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="metrics-section">
                <h3>Actividades por Mes (Últimos 12 meses)</h3>
                <div className="metrics-list">
                    {metrics.byMonth.map((item, index) => (
                        <div key={index} className="metric-item">
                            <span className="metric-label">{item.bucket}</span>
                            <span className="metric-total">{item.total}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}