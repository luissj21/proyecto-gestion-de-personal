const asistenciaService = require("../services/asistencia.service");

const registrarAsistencia = async (req, res) => {
  try {
    const resultado = await asistenciaService.crearAsistencia(
      req.body,
      req.usuario,
    );
    res.json(resultado);
  } catch (error) {
    res.status(400).json(error);
  }
};

const getAsistencias = async (req, res) => {
  try {
    const { empleado, desde, hasta } = req.query;

    let id_empleado = empleado || null;

    if (req.usuario.rol === "empleado") {
      id_empleado = req.usuario.id_empleado;
    }

    const filtros = {
      id_empleado,
      desde: desde || null,
      hasta: hasta || null,
    };

    let resultado = await asistenciaService.obtenerAsistencias(filtros);

    resultado = resultado.map((r) => ({
      ...r,
      horas_trabajadas: r.horas_trabajadas
        ? parseFloat(r.horas_trabajadas)
        : null,
    }));

    res.json({
      total: resultado.length,
      data: resultado,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getReporteMensual = async (req, res) => {
  try {
    const { mes } = req.query;

    if (!mes) {
      return res.status(400).json({
        message: "El parámetro 'mes' es obligatorio (YYYY-MM)",
      });
    }

    let resultado = await asistenciaService.obtenerReporteMensual(mes);

    //  Convertir TODO a números
    resultado = resultado.map((r) => ({
      ...r,
      total_registros: parseInt(r.total_registros) || 0,
      puntual: parseInt(r.puntual) || 0,
      retardos: parseInt(r.retardos) || 0,
      faltas: parseInt(r.faltas) || 0,
      horas_totales: r.horas_totales ? parseFloat(r.horas_totales) : 0,
    }));

    //  RESUMEN GLOBAL (nivel pro)
    const resumen = {
      total_faltas: resultado.reduce((acc, r) => acc + r.faltas, 0),
      total_retardos: resultado.reduce((acc, r) => acc + r.retardos, 0),
      total_puntuales: resultado.reduce((acc, r) => acc + r.puntual, 0),
      total_horas: resultado.reduce((acc, r) => acc + r.horas_totales, 0),
    };

    res.json({
      mes,
      total_empleados: resultado.length,
      resumen,
      data: resultado,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getSalarioMensual = async (req, res) => {
  try {
    const { mes } = req.query;

    if (!mes) {
      return res.status(400).json({
        message: "El parámetro 'mes' es obligatorio (YYYY-MM)",
      });
    }

    let id_empleado = null;

    //  Si es empleado → filtrar por su id
    if (req.usuario.rol === "empleado") {
      id_empleado = req.usuario.id_empleado;
    }
    console.log("USUARIO:", req.usuario);

    const resultado = await asistenciaService.obtenerSalarioMensual(
      mes,
      id_empleado,
    );

    res.json({
      mes,
      total_empleados: resultado.length,
      data: resultado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

const putAsistencia = async (req, res) => {
  try {
    if (req.usuario.rol === "empleado") {
      return res.status(403).json({
        message: "No tienes permiso para editar asistencias",
      });
    }

    const result = await asistenciaService.actualizarAsistencia(
      req.params.id,
      req.body,
    );

    res.json(result);
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteAsistencia = async (req, res) => {
  try {
    if (req.usuario.rol !== "admin") {
      return res.status(403).json({
        message: "No tienes permiso para eliminar asistencias",
      });
    }

    const result = await asistenciaService.eliminarAsistencia(req.params.id);

    res.json({
      message: "Asistencia eliminada",
      result,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

const registrarEntrada = async (req, res) => {
  try {
    console.log("USUARIO EN REQUEST:", req.usuario);

    if (req.usuario.rol !== "empleado") {
      return res.status(403).json({ message: "Solo empleados" });
    }

    const result = await asistenciaService.registrarEntrada(
      req.usuario.id_empleado,
    );

    res.json(result);
  } catch (error) {
    console.error("ERROR BACKEND:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Ya registraste tu entrada hoy",
      });
    }

    res.status(400).json({
      message: error.message || "Error al registrar entrada",
    });
  }
};

const registrarSalida = async (req, res) => {
  try {
    if (req.usuario.rol !== "empleado") {
      return res.status(403).json({ message: "Solo empleados" });
    }

    const result = await asistenciaService.registrarSalida(
      req.usuario.id_empleado,
    );

    res.json(result);
  } catch (error) {
    console.error("ERROR BACKEND:", error);
    res.status(400).json({
      message: error.message || "Error al registrar salida",
    });
  }
};

module.exports = {
  registrarAsistencia,
  getAsistencias,
  getReporteMensual,
  getSalarioMensual,
  putAsistencia,
  deleteAsistencia,
  registrarEntrada,
  registrarSalida,
};
