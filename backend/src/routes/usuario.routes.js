const express = require("express");
const router = express.Router();

const {
  registrar,
  login,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
} = require("../controllers/usuario.controller");

router.post("/registro", registrar);
router.post("/login", login);

//  NUEVAS
router.get("/usuarios", obtenerUsuarios);
router.put("/usuarios/:id", actualizarUsuario);
router.delete("/usuarios/:id", eliminarUsuario);

module.exports = router;
// const express = require("express");
// const router = express.Router();

// const { registrar, login } = require("../controllers/usuario.controller");

// const {
//   getUsuarios,
//   updateUsuario,
//   deleteUsuario,
// } = require("../controllers/usuario.controller");

// router.post("/registro", registrar);
// router.post("/login", login);

// router.get("/usuarios", getUsuarios);
// router.put("/usuarios/:id", updateUsuario);
// router.delete("/usuarios/:id", deleteUsuario);

// module.exports = router;
