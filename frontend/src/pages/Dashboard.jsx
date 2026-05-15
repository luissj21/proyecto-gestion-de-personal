import { useEffect, useState } from "react";
import api from "../api/api";
import KpiCard from "../components/KpiCard";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [mes, setMes] = useState("2026-04");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/dashboard?mes=${mes}`);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [mes]);

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "30px" }}>Dashboard</h1>

      <input
        type="month"
        value={mes}
        onChange={(e) => setMes(e.target.value)}
        style={{ marginBottom: "20px" }}
      />

      {loading && <p>Cargando...</p>}

      {data && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          <KpiCard
            title="Empleados activos"
            value={data.empleados_activos}
            icon="👥"
            color="#4caf50"
          />

          <KpiCard
            title="Faltas"
            value={data.faltas || 0}
            icon="❌"
            color="#f44336"
          />

          <KpiCard
            title="Retardos"
            value={data.retardos || 0}
            icon="⏰"
            color="#ff9800"
          />

          <KpiCard
            title="Horas trabajadas"
            value={data.horas_totales || 0}
            icon="📊"
            color="#2196f3"
          />

          <KpiCard
            title="Nómina total"
            value={`$${data.nomina_total || 0}`}
            icon="💰"
            color="#9c27b0"
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
