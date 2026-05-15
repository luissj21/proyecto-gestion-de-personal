const express = require("express");
const router = express.Router();

//  Controllers
const {
  registrarAsistencia,
  getAsistencias,
  getReporteMensual,
  getSalarioMensual,
  putAsistencia,
  deleteAsistencia,
  registrarEntrada,
  registrarSalida,
} = require("../controllers/asistencia.controller");

//  Middleware (usa SOLO UNA ruta correcta)
const { verificarToken } = require("../middleware/auth.middleware");

//  Services (solo para dashboard)
const asistenciaService = require("../services/asistencia.service");

//
//  RUTAS ASISTENCIAS
//
router.post("/asistencias", verificarToken, registrarAsistencia);
router.get("/asistencias", verificarToken, getAsistencias);
router.get("/asistencias/reporte-mensual", verificarToken, getReporteMensual);
router.get("/asistencias/salario", verificarToken, getSalarioMensual);
router.put("/asistencias/:id", verificarToken, putAsistencia);
router.delete("/asistencias/:id", verificarToken, deleteAsistencia);

//Registrar entrada
router.post("/asistencias/entrada", verificarToken, registrarEntrada);
router.post("/asistencias/salida", verificarToken, registrarSalida);
//  DASHBOARD

router.get("/dashboard", verificarToken, async (req, res) => {
  try {
    const { mes } = req.query;
    const data = await asistenciaService.obtenerResumenDashboard(mes);

    res.json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
});

module.exports = router;
