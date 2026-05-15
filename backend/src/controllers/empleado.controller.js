const empleadoService = require("../services/empleado.service");

const getEmpleados = async (req, res) => {
  try {
    const empleados = await empleadoService.obtenerEmpleados(req.query);
    res.json(empleados);
  } catch (error) {
    res.status(500).json(error);
  }
};

const postEmpleado = async (req, res) => {
  try {
    const result = await empleadoService.crearEmpleado(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json(error);
  }
};

const putEmpleado = async (req, res) => {
  try {
    const result = await empleadoService.actualizarEmpleado(
      req.params.id,
      req.body,
    );
    res.json(result);
  } catch (error) {
    res.status(404).json(error);
  }
};

const deleteEmpleado = async (req, res) => {
  try {
    const result = await empleadoService.eliminarEmpleado(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json(error);
  }
};

const patchEstadoEmpleado = async (req, res) => {
  try {
    const { estado } = req.body;

    const result = await empleadoService.cambiarEstadoEmpleado(
      req.params.id,
      estado,
    );

    res.json(result);
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = {
  getEmpleados,
  postEmpleado,
  putEmpleado,
  deleteEmpleado,
  patchEstadoEmpleado,
};
