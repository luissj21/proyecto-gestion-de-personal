import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMsg("");

      const res = await api.post("/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.usuario));

      if (res.data.usuario.rol === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/asistencias");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || "Error en login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Hola, Bienvenido. Inicia sesión</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="email"
            placeholder="Correo electrónico"
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

          {errorMsg && <p style={styles.error}>{errorMsg}</p>}

          <button style={styles.button} disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    background: "#111827",
    padding: "40px",
    borderRadius: "16px",
    width: "350px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  title: {
    color: "white",
    textAlign: "center",
    marginBottom: "10px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #374151",
    background: "#1f2937",
    color: "white",
    outline: "none",
  },

  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#3b82f6",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.2s",
  },

  error: {
    color: "#f87171",
    fontSize: "14px",
    textAlign: "center",
  },
};

export default Login;
