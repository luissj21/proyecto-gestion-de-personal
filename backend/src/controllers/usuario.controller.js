const usuarioService = require("../services/usuario.service");

const registrar = async (req, res) => {
  try {
    const result = await usuarioService.registrarUsuario(req.body);
    res.json(result);
  } catch (error) {
    console.error("ERROR BACKEND:", error);

    res.status(400).json({
      message: error.sqlMessage || error.message || "Error en registro",
    });
  }
};

const login = async (req, res) => {
  try {
    const result = await usuarioService.loginUsuario(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json(error);
  }
};

const obtenerUsuarios = async (req, res) => {
  try {
    const data = await usuarioService.obtenerUsuarios();
    res.json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const result = await usuarioService.actualizarUsuario(
      req.params.id,
      req.body,
    );
    res.json(result);
  } catch (error) {
    res.status(400).json(error);
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const result = await usuarioService.eliminarUsuario(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = {
  registrar,
  login,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
};
