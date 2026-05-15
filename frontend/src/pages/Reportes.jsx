import { useEffect, useState } from "react";
import api from "../api/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Reportes = () => {
  const [data, setData] = useState([]);
  const [mes, setMes] = useState("2026-04");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReportes = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/asistencias/salario?mes=${mes}`);
      console.log("DATA:", res.data.data);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los reportes");
    } finally {
      setLoading(false);
    }
  };

  const generarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Reporte de Nómina", 14, 20);

    doc.setFontSize(12);
    doc.text(`Mes: ${mes}`, 14, 30);

    const tableData = data.map((item) => [
      item.nombre_completo,
      item.puntual,
      item.faltas,
      item.retardos,
      item.horas_totales,
      `$${item.salario_base}`,
      `$${item.total_descuentos}`,
      `$${item.bono_puntualidad}`,
      `$${item.salario_final}`,
    ]);

    autoTable(doc, {
      startY: 40,
      head: [
        [
          "Empleado",
          "Puntual",
          "Faltas",
          "Retardos",
          "Horas",
          "Salario Base",
          "Descuentos",
          "Bono",
          "Salario Final",
        ],
      ],
      body: tableData,
    });

    const totalNomina = data.reduce((acc, item) => acc + item.salario_final, 0);

    doc.text(
      `Total nómina: $${totalNomina.toFixed(2)}`,
      14,
      doc.lastAutoTable.finalY + 10,
    );

    doc.save(`reporte_nomina_${mes}.pdf`);
  };

  useEffect(() => {
    fetchReportes();
  }, [mes]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#e2e8f0",
        padding: "40px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* 🔹 HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <h1 style={{ fontSize: "28px" }}>Reporte mensual de nómina</h1>

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="month"
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #334155",
                background: "#1e293b",
                color: "white",
              }}
            />
            {data.length > 0 && (
              <button
                onClick={generarPDF}
                style={{
                  background: "#6366f1",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "0.2s",
                }}
                onMouseOver={(e) => (e.target.style.background = "#4f46e5")}
                onMouseOut={(e) => (e.target.style.background = "#6366f1")}
              >
                Exportar PDF
              </button>
            )}
          </div>
        </div>

        {/* 🔹 ESTADOS */}
        {loading && <p>Cargando...</p>}
        {error && <p style={{ color: "#f87171" }}>{error}</p>}
        {!loading && data.length === 0 && (
          <p>No hay datos de nómina para este mes</p>
        )}

        {/* 🔹 TABLA */}
        {!loading && data.length > 0 && (
          <div
            style={{
              background: "#1e293b",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead style={{ background: "#334155" }}>
                <tr>
                  <th style={th}>Empleado</th>
                  <th style={th}>Puntual</th>
                  <th style={th}>Faltas</th>
                  <th style={th}>Retardos</th>
                  <th style={th}>Horas</th>
                  <th style={th}>Salario Base</th>
                  <th style={th}>Desc. Faltas</th>
                  <th style={th}>Desc. Retardos</th>
                  <th style={th}>Total Desc.</th>
                  <th style={th}>Bono</th>
                  <th style={th}>Salario Final</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={item.id_empleado}
                    style={{
                      background: index % 2 === 0 ? "#1e293b" : "#0f172a",
                    }}
                  >
                    <td style={td}>{item.nombre_completo}</td>
                    <td style={td}>{item.puntual}</td>
                    <td style={td}>{item.faltas}</td>
                    <td style={td}>{item.retardos}</td>
                    <td style={td}>{item.horas_totales}</td>
                    <td style={td}>${item.salario_base}</td>
                    <td style={td}>${item.descuento_faltas}</td>
                    <td style={td}>${item.descuento_retardos}</td>
                    <td style={td}>${item.total_descuentos}</td>
                    <td style={{ ...td, color: "#22c55e" }}>
                      +${item.bono_puntualidad}
                    </td>
                    <td style={{ ...td, fontWeight: "bold" }}>
                      ${item.salario_final}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const th = {
  padding: "12px",
  textAlign: "center",
  fontSize: "14px",
};

const td = {
  padding: "12px",
  textAlign: "center",
  borderTop: "1px solid #334155",
  fontSize: "14px",
};

export default Reportes;

// import { useEffect, useState } from "react";
// import api from "../api/api";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// const Reportes = () => {
//   const [data, setData] = useState([]);
//   const [mes, setMes] = useState("2026-04");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchReportes = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const res = await api.get(`/asistencias/salario?mes=${mes}`);
//       setData(res.data.data);
//     } catch (err) {
//       console.error(err);
//       setError("Error al cargar los reportes");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generarPDF = () => {
//     const doc = new jsPDF();

//     //  Título
//     doc.setFontSize(18);
//     doc.text("Reporte de Nómina", 14, 20);

//     //  Subtítulo
//     doc.setFontSize(12);
//     doc.text(`Mes: ${mes}`, 14, 30);

//     //  Tabla
//     const tableData = data.map((item) => [
//       item.nombre_completo,
//       item.puntual,
//       item.faltas,
//       item.retardos,
//       item.horas_totales,
//       `$${item.salario_base}`,
//       `$${item.total_descuentos}`,
//       `$${item.bono_puntualidad}`,
//       `$${item.salario_final}`,
//     ]);

//     autoTable(doc, {
//       startY: 40,
//       head: [
//         [
//           "Empleado",
//           "Puntual",
//           "Faltas",
//           "Retardos",
//           "Horas",
//           "Salario Base",
//           "Descuentos",
//           "Bono",
//           "Salario Final",
//         ],
//       ],
//       body: tableData,
//     });

//     //  Totales (pro)
//     const totalNomina = data.reduce((acc, item) => acc + item.salario_final, 0);

//     doc.text(
//       `Total nómina: $${totalNomina.toFixed(2)}`,
//       14,
//       doc.lastAutoTable.finalY + 10,
//     );

//     //  Descargar
//     doc.save(`reporte_nomina_${mes}.pdf`);
//   };

//   useEffect(() => {
//     fetchReportes();
//   }, [mes]);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1 style={{ fontSize: "32px", marginBottom: "30px" }}>
//         Reporte mensual de nómina
//       </h1>
//       <button onClick={generarPDF} style={{ marginBottom: "15px" }}>
//         Exportar PDF
//       </button>

//       <input
//         type="month"
//         value={mes}
//         onChange={(e) => setMes(e.target.value)}
//         style={{ marginBottom: "20px" }}
//       />

//       {loading && <p>Cargando...</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {!loading && data.length === 0 && <p>No hay datos</p>}

//       {!loading && data.length > 0 && (
//         <table
//           border="1"
//           cellPadding="10"
//           style={{ width: "100%", textAlign: "center" }}
//         >
//           <thead>
//             <tr>
//               <th>Empleado</th>
//               <th>Puntual</th>
//               <th>Faltas</th>
//               <th>Retardos</th>
//               <th>Horas</th>
//               <th>Salario Base</th>
//               <th>Desc. Faltas</th>
//               <th>Desc. Retardos</th>
//               <th>Total Desc.</th>
//               <th>Bono</th>
//               <th>Salario Final</th>
//             </tr>
//           </thead>

//           <tbody>
//             {data.map((item) => (
//               <tr key={item.id_empleado}>
//                 <td>{item.nombre_completo}</td>
//                 <td>{item.puntual}</td>
//                 <td>{item.faltas}</td>
//                 <td>{item.retardos}</td>
//                 <td>{item.horas_totales}</td>
//                 <td>${item.salario_base}</td>
//                 <td>${item.descuento_faltas}</td>
//                 <td>${item.descuento_retardos}</td>
//                 <td>${item.total_descuentos}</td>
//                 <td style={{ color: "green" }}>+${item.bono_puntualidad}</td>
//                 <td>
//                   <strong>${item.salario_final}</strong>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default Reportes;
