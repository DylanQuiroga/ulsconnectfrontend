import { adminService } from '../../services/adminService';
import { FaDownload } from 'react-icons/fa';

export default function ExportButtons() {
    const handleExportEnrollments = async () => {
        try {
            const blob = await adminService.exportEnrollments();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `inscripciones_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting enrollments:', error);
            alert('Error al exportar inscripciones');
        }
    };

    const handleExportAttendance = async () => {
        try {
            const blob = await adminService.exportAttendance();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `asistencias_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting attendance:', error);
            alert('Error al exportar asistencias');
        }
    };

    return (
        <div className="export-buttons">
            <button onClick={handleExportEnrollments} className="export-btn">
                <FaDownload /> Exportar Inscripciones
            </button>
            <button onClick={handleExportAttendance} className="export-btn">
                <FaDownload /> Exportar Asistencias
            </button>
        </div>
    );
}