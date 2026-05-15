const express = require("express");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

// DB
require("./config/db");

// Rutas
const empleadosRoutes = require("./routes/empleados.routes");
const asistenciasRoutes = require("./routes/asistencias.routes");
const usuarioRoutes = require("./routes/usuario.routes");

// Base
app.get("/", (req, res) => {
  res.send("API funcionando ");
});

app.use("/api", empleadosRoutes);
app.use("/api", asistenciasRoutes);
app.use("/api", usuarioRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

// const express = require("express");
// const app = express();
// const cors = require("cors");

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//   }),
// );
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("API funcionando ");
// });

// const PORT = 3000;

// app.listen(PORT, () => {
//   console.log(`Servidor corriendo en puerto ${PORT}`);
// });
// require("./config/db");
// const empleadosRoutes = require("./routes/empleados.routes");

// app.use("/api", empleadosRoutes);

// const asistenciasRoutes = require("./routes/asistencias.routes");

// app.use("/api", asistenciasRoutes);

// const usuarioRoutes = require("./routes/usuario.routes");

// app.use("/api", usuarioRoutes);

// const asistenciasRoutes = require("./routes/asistencias.routes");

// app.use("/api/asistencias", asistenciasRoutes);
