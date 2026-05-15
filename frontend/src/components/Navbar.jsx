import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  // 🔹 Obtener usuario del localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <nav
      style={{
        width: "100%",
        background: "#1e293b",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/*  Links */}
      <div style={{ display: "flex", gap: "15px" }}>
        {usuario?.rol === "admin" && (
          <>
            <Link style={linkStyle} to="/empleados">
              Empleados
            </Link>
            <Link style={linkStyle} to="/usuarios">
              Usuarios
            </Link>
            <Link style={linkStyle} to="/dashboard">
              Dashboard
            </Link>
          </>
        )}

        <Link style={linkStyle} to="/asistencias">
          Asistencias
        </Link>

        <Link style={linkStyle} to="/reportes">
          {usuario?.rol === "admin" ? "Reportes" : "Mi Nómina"}
        </Link>
      </div>

      {/*  Usuario */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span>
          {usuario?.email} ({usuario?.rol})
        </span>

        <button
          onClick={logout}
          style={{
            background: "#ef4444",
            border: "none",
            padding: "8px 12px",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  background: "#334155",
};

export default Navbar;
