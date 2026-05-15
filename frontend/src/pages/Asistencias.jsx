import { useEffect, useState } from "react";
import api from "../api/api";

const Asistencias = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState(null);

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const [filtros, setFiltros] = useState({
    empleado: "",
    desde: "",
    hasta: "",
  });

  const [form, setForm] = useState({
    id_empleado: "",
    fecha: "",
    hora_entrada: "",
    hora_salida: "",
    observaciones: "",
  });

  // 🔹 Cargar empleados
  const fetchEmpleados = async () => {
    try {
      const res = await api.get("/empleados");
      setEmpleados(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Cargar asistencias
  const fetchAsistencias = async () => {
    try {
      setLoading(true);

      let url = "/asistencias?";

      if (filtros.empleado) url += `empleado=${filtros.empleado}&`;
      if (filtros.desde) url += `desde=${filtros.desde}&`;
      if (filtros.hasta) url += `hasta=${filtros.hasta}`;

      const res = await api.get(url);
      setAsistencias(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpleados();
    fetchAsistencias();
  }, []);

  useEffect(() => {
    fetchAsistencias();
  }, [filtros]);

  // 🔹 Manejo formulario
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFiltroChange = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Guardar / Editar
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editando) {
        await api.put(`/asistencias/${editando}`, form);
        alert("Asistencia editada exitosamente");
      } else {
        await api.post("/asistencias", form);
        alert("Asistencia registrada correctamente");
      }

      fetchAsistencias();

      setForm({
        id_empleado: "",
        fecha: "",
        hora_entrada: "",
        hora_salida: "",
        observaciones: "",
      });

      setEditando(null);
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Editar
  const handleEdit = (a) => {
    setForm({
      id_empleado: a.id_empleado,
      fecha: a.fecha,
      hora_entrada: a.hora_entrada,
      hora_salida: a.hora_salida,
      observaciones: a.observaciones || "",
    });

    setEditando(a.id_asistencia);
  };

  // 🔹 Eliminar
  const eliminar = async (id) => {
    if (!confirm("¿Eliminar asistencia?")) return;

    try {
      await api.delete(`/asistencias/${id}`);
      fetchAsistencias();
    } catch (err) {
      console.error(err);
    }
  };

  const registrarEntrada = async () => {
    try {
      await api.post("/asistencias/entrada");
      alert("Entrada registrada");
      fetchAsistencias();
    } catch (error) {
      console.error("ERROR COMPLETO:", error.response?.data);

      alert(
        error.response?.data?.message ||
          JSON.stringify(error.response?.data) ||
          "Error desconocido",
      );
    }
  };

  const registrarSalida = async () => {
    try {
      await api.post("/asistencias/salida");
      alert("Salida registrada");
      fetchAsistencias();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Gestión de Asistencias</h1>

      {usuario?.rol === "empleado" && (
        <div style={{ marginBottom: "20px" }}>
          <button style={styles.entradaBtn} onClick={registrarEntrada}>
            🟢 Registrar Entrada
          </button>

          <button style={styles.salidaBtn} onClick={registrarSalida}>
            🔴 Registrar Salida
          </button>
        </div>
      )}

      {/* 🔹 FORMULARIO (solo admin) */}
      {usuario?.rol === "admin" && (
        <div style={styles.card}>
          <form onSubmit={handleSubmit}>
            <div style={styles.grid}>
              <select
                name="id_empleado"
                disabled={editando !== null}
                value={form.id_empleado}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">Seleccionar empleado</option>
                {empleados.map((emp) => (
                  <option key={emp.id_empleado} value={emp.id_empleado}>
                    {emp.nombre_completo}
                  </option>
                ))}
              </select>

              <input
                type="time"
                name="hora_entrada"
                value={form.hora_entrada}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                type="time"
                name="hora_salida"
                value={form.hora_salida}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                type="date"
                name="fecha"
                disabled={editando !== null}
                value={form.fecha}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                name="observaciones"
                placeholder="Observaciones"
                value={form.observaciones}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <button style={styles.primaryBtn}>
              {editando ? "Actualizar" : "Registrar"}
            </button>
          </form>
        </div>
      )}

      {/* 🔹 FILTROS */}
      <div style={styles.filters}>
        {usuario?.rol === "admin" && (
          <select name="empleado" onChange={handleFiltroChange}>
            <option value="">Todos</option>
            {empleados.map((emp) => (
              <option key={emp.id_empleado} value={emp.id_empleado}>
                {emp.nombre_completo}
              </option>
            ))}
          </select>
        )}

        <input type="date" name="desde" onChange={handleFiltroChange} />
        <input type="date" name="hasta" onChange={handleFiltroChange} />
      </div>

      {/* 🔹 TABLA */}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Empleado</th>
              <th>Fecha</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Estado</th>
              <th>Horas</th>
              {usuario?.rol === "admin" && <th>Acciones</th>}
            </tr>
          </thead>

          <tbody>
            {asistencias.map((a) => (
              <tr key={a.id_asistencia}>
                <td>{a.nombre_completo}</td>
                <td>{a.fecha}</td>
                <td>{a.hora_entrada}</td>
                <td>{a.hora_salida}</td>
                <td>{a.estado}</td>
                <td>{a.horas_trabajadas}</td>

                {usuario?.rol === "admin" && (
                  <td>
                    <button
                      style={styles.editBtn}
                      onClick={() => handleEdit(a)}
                    >
                      ✏️ Editar
                    </button>

                    <button
                      style={styles.deleteBtn}
                      onClick={() => eliminar(a.id_asistencia)}
                    >
                      🗑 Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Asistencias;

/*  ESTILOS PRO */
const styles = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "#e2e8f0",
    padding: "40px",
  },
  title: {
    fontSize: "28px",
    marginBottom: "20px",
  },
  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "none",
  },
  primaryBtn: {
    marginTop: "10px",
    background: "#22c55e",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  filters: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    background: "#1e293b",
    borderCollapse: "collapse",
  },
  editBtn: {
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "5px",
    marginRight: "5px",
    cursor: "pointer",
  },
  deleteBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  entradaBtn: {
    background: "#22c55e",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    marginRight: "10px",
    cursor: "pointer",
  },

  salidaBtn: {
    background: "#ef4444",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
