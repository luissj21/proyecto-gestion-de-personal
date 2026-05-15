const express = require("express");
const router = express.Router();
const {
  getEmpleados,
  postEmpleado,
  putEmpleado,
  deleteEmpleado,
  patchEstadoEmpleado,
} = require("../controllers/empleado.controller");
const {
  verificarToken,
  verificarRol,
} = require("../middleware/auth.middleware");

router.get("/empleados", verificarToken, getEmpleados);
router.post(
  "/empleados",
  verificarToken,
  verificarRol(["admin"]),
  postEmpleado,
);
router.put(
  "/empleados/:id",
  verificarToken,
  verificarRol(["admin"]),
  putEmpleado,
);
router.delete("/empleados/:id", deleteEmpleado);
router.patch(
  "/empleados/:id/estado",
  verificarToken,
  verificarRol(["admin"]),
  patchEstadoEmpleado,
);

module.exports = router;
