import React from "react";
import { LeaderboardEntry } from "../../services/adminService";

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
}

const LeaderboardTable: React.FC<{ leaderboard: any[] }> = ({ leaderboard }) => {
  return (
    <table className="activity-table">
      <thead>
        <tr>
          <th>Posición</th>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Puntos</th>
          <th>Rol</th>
        </tr>
      </thead>
      <tbody>
        {leaderboard.map((v, index) => (
          <tr key={v.id}>
            <td>{index + 1}</td>
            <td>{v.nombre}</td>
            <td>{v.correoUniversitario}</td>
            <td>{v.puntos}</td>
            <td>{v.rol}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};


export default LeaderboardTable;

