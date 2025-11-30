import React from "react";
import "./css/LeaderBoard.css";

type Volunteer = {
  id: number;
  name: string;
  points: number;
  activities: number;
  recognition?: string;
};

const volunteers: Volunteer[] = [
  { id: 1, name: "Ana Martínez", points: 120, activities: 12, recognition: "🥇 Voluntaria del mes" },
  { id: 2, name: "Pedro López", points: 95, activities: 9, recognition: "💪 Compromiso total" },
  { id: 3, name: "Sofía Torres", points: 80, activities: 8, recognition: "🌱 Nuevo talento" },
  { id: 4, name: "Juan Pérez", points: 65, activities: 7 },
  { id: 5, name: "Carla Rivas", points: 50, activities: 5 },
];

const LeaderBoard: React.FC = () => {
  return (
    <div className="dashboard-section leaderboard-section">
      <h2>🏆 Leaderboard de Voluntarios</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Posición</th>
            <th>Nombre</th>
            <th>Puntos</th>
            <th>Actividades</th>
            <th>Reconocimientos</th>
          </tr>
        </thead>
        <tbody>
          {volunteers.map((v, index) => (
            <tr
              key={v.id}
              className={
                index === 0
                  ? "first-place"
                  : index === 1
                  ? "second-place"
                  : index === 2
                  ? "third-place"
                  : ""
              }
            >
              <td>{index + 1}</td>
              <td>{v.name}</td>
              <td>{v.points}</td>
              <td>{v.activities}</td>
              <td>{v.recognition || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderBoard;
