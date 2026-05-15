import { useState, useEffect } from "react";
import api from "../api/api";

const Usuarios = () => {
  //  Formulario
  const [form, setForm] = useState({
    email: "",
    password: "",
    rol: "empleado",
    id_empleado: "",
  });

  //  Estados globales
  const [usuarios, setUsuarios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState("");
  const [editingId, setEditingId] = useState(null);

  //  Cargar datos iniciales
  useEffect(() => {
    fetchUsuarios();
    fetchEmpleados();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await api.get("/usuarios");
      setUsuarios(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Error al cargar usuarios");
    }
  };

  const fetchEmpleados = async () => {
    try {
      const res = await api.get("/empleados");
      setEmpleados(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError("Error al cargar empleados");
    }
  };

  //  Manejo de inputs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  //  Crear / Editar
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setMsg("");

      if (editingId) {
        await api.put(`/usuarios/${editingId}`, form);
        setMsg("Usuario actualizado correctamente");
      } else {
        await api.post("/registro", form);
        setMsg("Usuario creado correctamente");
      }

      resetForm();
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error al guardar usuario");
    } finally {
      setLoading(false);
    }
  };

  //  Editar
  const handleEdit = (usuario) => {
    setForm({
      email: usuario.email,
      password: "", // no mostramos password
      rol: usuario.rol,
      id_empleado: usuario.id_empleado || "",
    });

    setEditingId(usuario.id);
  };

  //  Eliminar
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar usuario?")) return;

    try {
      await api.delete(`/usuarios/${id}`);
      setMsg("Usuario eliminado");
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      setError("Error al eliminar usuario");
    }
  };

  //  Reset form
  const resetForm = () => {
    setForm({
      email: "",
      password: "",
      rol: "empleado",
      id_empleado: "",
    });
    setEditingId(null);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Gestión de Usuarios</h1>

      {/*  MENSAJES */}
      {error && <p style={styles.error}>{error}</p>}
      {msg && <p style={styles.success}>{msg}</p>}

      {/*  FORM */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>{editingId ? "Editar Usuario" : "Crear Usuario"}</h2>

        <input
          name="email"
          placeholder="Correo"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
        />

        <select
          name="rol"
          value={form.rol}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="empleado">Empleado</option>
          <option value="admin">Administrador</option>
        </select>

        <select
          name="id_empleado"
          value={form.id_empleado}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Seleccionar empleado</option>
          {Array.isArray(empleados) &&
            empleados.map((emp) => (
              <option key={emp.id_empleado} value={emp.id_empleado}>
                {emp.nombre_completo}
              </option>
            ))}
        </select>

        <div style={styles.buttonGroup}>
          <button style={styles.primaryBtn} disabled={loading}>
            {loading
              ? "Guardando..."
              : editingId
                ? "Actualizar"
                : "Crear Usuario"}
          </button>

          {editingId && (
            <button type="button" style={styles.cancelBtn} onClick={resetForm}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/*  TABLA */}
      <div style={styles.tableContainer}>
        <h2>Usuarios registrados</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Rol</th>
              <th>Empleado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.rol}</td>
                <td>{u.nombre_completo || "—"}</td>

                <td>
                  <button style={styles.editBtn} onClick={() => handleEdit(u)}>
                    Editar
                  </button>

                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(u.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Usuarios;

const styles = {
  container: {
    padding: "30px",
    fontFamily: "Arial",
  },
  title: {
    fontSize: "32px",
    marginBottom: "20px",
  },
  form: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "30px",
    color: "white",
  },
  input: {
    display: "block",
    width: "100%",
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
  },
  primaryBtn: {
    background: "#3b82f6",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  cancelBtn: {
    background: "#64748b",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  tableContainer: {
    marginTop: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  editBtn: {
    marginRight: "10px",
    background: "#f59e0b",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  deleteBtn: {
    background: "#ef4444",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },
  error: {
    color: "#ef4444",
  },
  success: {
    color: "#22c55e",
  },
};
