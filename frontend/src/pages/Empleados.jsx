import { useEffect, useState } from "react";
import api from "../api/api";

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [estado, setEstado] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nombre_completo: "",
    departamento: "",
    puesto: "",
    tipo_contrato: "",
    salario_base: "",
  });

  const [editando, setEditando] = useState(null);

  //  Obtener empleados
  const fetchEmpleados = async () => {
    try {
      setLoading(true);

      let url = "/empleados?";

      if (estado) url += `estado=${estado}&`;
      if (departamento) url += `departamento=${departamento}`;

      const res = await api.get(url);
      setEmpleados(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, [estado, departamento]);

  //  Formulario
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  //  Crear / Actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editando) {
        await api.put(`/empleados/${editando}`, form);
        alert("Empleado editado exitosamente");
      } else {
        await api.post("/empleados", form);
        alert("Empleado registrado correctamente");
      }

      fetchEmpleados();

      setForm({
        nombre_completo: "",
        departamento: "",
        puesto: "",
        tipo_contrato: "",
        salario_base: "",
      });

      setEditando(null);
    } catch (error) {
      console.error(error);
    }
  };

  //  Editar
  const handleEdit = (emp) => {
    setForm({
      nombre_completo: emp.nombre_completo || "",
      departamento: emp.departamento || "",
      puesto: emp.puesto || "",
      tipo_contrato: emp.tipo_contrato || "",
      salario_base: emp.salario_base || "",
    });

    setEditando(emp.id_empleado);
  };

  //  Cambiar estado
  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await api.patch(`/empleados/${id}/estado`, {
        estado: nuevoEstado,
      });

      fetchEmpleados();
    } catch (error) {
      console.error(error);
    }
  };

  //  Formato dinero
  const formatMoney = (value) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "#e2e8f0",
        padding: "40px",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* 🔹 TÍTULO */}
        <h1 style={{ fontSize: "32px", marginBottom: "30px" }}>
          Gestión de Empleados
        </h1>

        {/* 🔹 FORMULARIO */}
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          <form onSubmit={handleSubmit}>
            <h3 style={{ marginBottom: "10px" }}>
              {editando ? "Editar empleado" : "Nuevo empleado"}
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "10px",
              }}
            >
              <input
                name="nombre_completo"
                placeholder="Nombre"
                value={form.nombre_completo}
                onChange={handleChange}
                style={{ padding: "10px", borderRadius: "6px", border: "none" }}
              />

              <input
                name="departamento"
                placeholder="Departamento"
                value={form.departamento}
                onChange={handleChange}
                style={{ padding: "10px", borderRadius: "6px", border: "none" }}
              />

              <input
                name="puesto"
                placeholder="Puesto"
                value={form.puesto}
                onChange={handleChange}
                style={{ padding: "10px", borderRadius: "6px", border: "none" }}
              />

              <input
                name="tipo_contrato"
                placeholder="Tipo contrato"
                value={form.tipo_contrato}
                onChange={handleChange}
                style={{ padding: "10px", borderRadius: "6px", border: "none" }}
              />

              <input
                name="salario_base"
                placeholder="Salario"
                type="number"
                value={form.salario_base}
                onChange={handleChange}
                style={{ padding: "10px", borderRadius: "6px", border: "none" }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: "10px",
                backgroundColor: "#22c55e",
                color: "white",
                padding: "10px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
            >
              {editando ? "Actualizar" : "Crear"}
            </button>
          </form>
        </div>

        {/* 🔹 FILTROS */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            style={{ padding: "10px", borderRadius: "6px" }}
          >
            <option value="">Todos</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>

          <input
            type="text"
            placeholder="Departamento"
            value={departamento}
            onChange={(e) => setDepartamento(e.target.value)}
            style={{ padding: "10px", borderRadius: "6px" }}
          />
        </div>

        {/* 🔹 ESTADO */}
        {loading && <p>Cargando...</p>}

        {/* 🔹 TABLA */}
        {!loading && (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#1e293b",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <thead style={{ backgroundColor: "#334155" }}>
              <tr>
                <th style={{ padding: "12px" }}>Nombre</th>
                <th style={{ padding: "12px" }}>Departamento</th>
                <th style={{ padding: "12px" }}>Puesto</th>
                <th style={{ padding: "12px" }}>Estado</th>
                <th style={{ padding: "12px" }}>Salario</th>
                <th style={{ padding: "12px" }}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {empleados.map((emp) => (
                <tr key={emp.id_empleado}>
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    {emp.nombre_completo}
                  </td>
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    {emp.departamento}
                  </td>
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    {emp.puesto}
                  </td>
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    {emp.estado}
                  </td>
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    {formatMoney(emp.salario_base)}
                  </td>

                  <td style={{ padding: "10px", textAlign: "center" }}>
                    <button
                      onClick={() => handleEdit(emp)}
                      style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        marginRight: "5px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Editar
                    </button>

                    <button
                      onClick={() =>
                        cambiarEstado(
                          emp.id_empleado,
                          emp.estado === "activo" ? "inactivo" : "activo",
                        )
                      }
                      style={{
                        backgroundColor:
                          emp.estado === "activo" ? "#ef4444" : "#22c55e",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      {emp.estado === "activo" ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Empleados;
