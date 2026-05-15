const db = require("../config/db");
const connection = require("../config/db");

const calcularAsistencia = (hora_entrada, hora_salida) => {
  let estado = "puntual";
  let horas_trabajadas = 0;

  //  Falta = no hay entrada
  if (!hora_entrada) {
    return { estado: "falta", horas_trabajadas: 0 };
  }

  const entrada = new Date(`1970-01-01T${hora_entrada}`);
  const salida = hora_salida ? new Date(`1970-01-01T${hora_salida}`) : null;

  const horaPuntual = new Date("1970-01-01T08:00:00");
  const horaRetardo = new Date("1970-01-01T08:15:00");

  // Solo retardos, nunca falta por hora
  if (entrada > horaRetardo) {
    estado = "retardo";
  } else if (entrada > horaPuntual) {
    estado = "retardo";
  }

  // Validar horas
  if (salida && salida > entrada) {
    horas_trabajadas =
      Math.round(((salida - entrada) / (1000 * 60 * 60)) * 100) / 100;
  }

  return { estado, horas_trabajadas };
};

const crearAsistencia = (data, usuario) => {
  return new Promise((resolve, reject) => {
    let { id_empleado, fecha, hora_entrada, hora_salida, observaciones } = data;

    //  CONTROL POR ROL
    if (usuario.rol === "empleado") {
      id_empleado = usuario.id_empleado;
    }

    const { estado, horas_trabajadas } = calcularAsistencia(
      hora_entrada,
      hora_salida,
    );

    const query = `
      INSERT INTO asistencias 
      (id_empleado, fecha, hora_entrada, hora_salida, estado, horas_trabajadas, observaciones)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        id_empleado,
        fecha,
        hora_entrada,
        hora_salida,
        estado,
        horas_trabajadas,
        observaciones,
      ],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return reject({
              message:
                "Ya existe una asistencia para este empleado en esta fecha",
            });
          }
          return reject(err);
        }

        resolve({
          message: "Asistencia registrada",
          estado,
          horas_trabajadas,
        });
      },
    );
  });
};

const obtenerAsistencias = (filtros) => {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT 
        a.id_asistencia,
        a.id_empleado,
        DATE_FORMAT(a.fecha, '%Y-%m-%d') as fecha,
        a.hora_entrada,
        a.hora_salida,
        a.estado,
        a.horas_trabajadas,
        a.observaciones,
        e.nombre_completo
      FROM asistencias a
      JOIN empleados e ON a.id_empleado = e.id_empleado
      WHERE 1=1
    `;

    const params = [];

    //  Filtro por empleado
    if (filtros.id_empleado) {
      query += " AND a.id_empleado = ?";
      params.push(filtros.id_empleado);
    }

    //  Filtros flexibles
    if (filtros.desde) {
      query += " AND a.fecha >= ?";
      params.push(filtros.desde);
    }

    if (filtros.hasta) {
      query += " AND a.fecha <= ?";
      params.push(filtros.hasta);
    }

    query += " ORDER BY a.fecha DESC";

    db.query(query, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const obtenerReporteMensual = (mes) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        e.id_empleado,
        e.nombre_completo,

        COUNT(a.id_asistencia) as total_registros,

        SUM(a.estado = 'puntual') as puntual,
        SUM(a.estado = 'retardo') as retardos,
        SUM(a.estado = 'falta') as faltas,

        SUM(a.horas_trabajadas) as horas_totales

      FROM empleados e
      LEFT JOIN asistencias a 
        ON e.id_empleado = a.id_empleado
        AND DATE_FORMAT(a.fecha, '%Y-%m') = ?

      WHERE e.estado = 'activo'

      GROUP BY e.id_empleado
      ORDER BY e.nombre_completo;
    `;

    db.query(query, [mes], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const obtenerSalarioMensual = (mes, id_empleado = null) => {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT 
        e.id_empleado,
        e.nombre_completo,
        e.salario_base,

        SUM(a.estado = 'puntual') as puntual,
        SUM(a.estado = 'retardo') as retardos,
        SUM(a.estado = 'falta') as faltas,

        SUM(a.horas_trabajadas) as horas_totales

      FROM empleados e
      LEFT JOIN asistencias a 
        ON e.id_empleado = a.id_empleado
        AND DATE_FORMAT(a.fecha, '%Y-%m') = ?

      WHERE e.estado = 'activo'
    `;

    const params = [mes];

    // FILTRO
    if (id_empleado) {
      query += ` AND e.id_empleado = ?`;
      params.push(id_empleado);
    }

    query += ` GROUP BY e.id_empleado`;

    db.query(query, params, (err, results) => {
      if (err) return reject(err);

      const [year, month] = mes.split("-");
      const diasMes = new Date(year, month, 0).getDate();

      const calculado = results.map((r) => {
        const salario_base = parseFloat(r.salario_base) || 0;

        const faltas = parseInt(r.faltas) || 0;
        const retardos = parseInt(r.retardos) || 0;
        const puntual = parseInt(r.puntual) || 0;
        const horas_totales = parseFloat(r.horas_totales) || 0;

        const salario_diario = salario_base / diasMes;

        const descuento_faltas = faltas * salario_diario;
        const dias_por_retardos = Math.floor(retardos / 3);
        const descuento_retardos = dias_por_retardos * salario_diario;

        const total_descuentos = descuento_faltas + descuento_retardos;

        const bono_puntualidad =
          puntual >= Math.floor(diasMes * 0.8) ? salario_base * 0.05 : 0;

        const salario_final =
          salario_base - total_descuentos + bono_puntualidad;

        return {
          id_empleado: r.id_empleado,
          nombre_completo: r.nombre_completo,

          salario_base,

          faltas,
          retardos,
          puntual,
          horas_totales,

          descuento_faltas: Number(descuento_faltas.toFixed(2)),
          descuento_retardos: Number(descuento_retardos.toFixed(2)),
          total_descuentos: Number(total_descuentos.toFixed(2)),

          bono_puntualidad: Number(bono_puntualidad.toFixed(2)),

          salario_final: Number(salario_final.toFixed(2)),
        };
      });

      resolve(calculado);
    });
  });
};

const actualizarAsistencia = (id, data) => {
  return new Promise((resolve, reject) => {
    const { hora_entrada, hora_salida, observaciones } = data;

    const { estado, horas_trabajadas } = calcularAsistencia(
      hora_entrada,
      hora_salida,
    );

    const query = `
      UPDATE asistencias
      SET hora_entrada = ?, hora_salida = ?, estado = ?, horas_trabajadas = ?, observaciones = ?
      WHERE id_asistencia = ?
    `;

    db.query(
      query,
      [hora_entrada, hora_salida, estado, horas_trabajadas, observaciones, id],
      (err, result) => {
        if (err) return reject(err);

        if (result.affectedRows === 0) {
          return reject({ message: "Asistencia no encontrada" });
        }

        resolve({
          message: "Asistencia actualizada",
          estado,
          horas_trabajadas,
        });
      },
    );
  });
};

const obtenerResumenDashboard = (mes) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        COUNT(DISTINCT e.id_empleado) as empleados_activos,

        SUM(a.estado = 'falta') as faltas,
        SUM(a.estado = 'retardo') as retardos,
        SUM(a.horas_trabajadas) as horas_totales,

        SUM(e.salario_base) as nomina_total

      FROM empleados e
      LEFT JOIN asistencias a 
        ON e.id_empleado = a.id_empleado
        AND DATE_FORMAT(a.fecha, '%Y-%m') = ?

      WHERE e.estado = 'activo'
    `;

    db.query(query, [mes], (err, results) => {
      if (err) return reject(err);

      resolve(results[0]);
    });
  });
};

const eliminarAsistencia = async (id) => {
  try {
    const [result] = await connection
      .promise()
      .query("DELETE FROM asistencias WHERE id_asistencia = ?", [id]);

    if (result.affectedRows === 0) {
      throw { message: "Asistencia no encontrada" };
    }

    return { message: "Asistencia eliminada correctamente" };
  } catch (error) {
    console.error("ERROR SERVICE:", error);
    throw error;
  }
};

const registrarEntrada = async (id_empleado) => {
  const hoy = new Date().toISOString().slice(0, 10);
  const ahora = new Date().toTimeString().slice(0, 8);

  await connection.promise().query(
    `
    INSERT INTO asistencias (id_empleado, fecha, hora_entrada)
    VALUES (?, ?, ?)
  `,
    [id_empleado, hoy, ahora],
  );

  return { message: "Entrada registrada" };
};

const registrarSalida = async (id_empleado) => {
  try {
    const hoy = new Date().toISOString().slice(0, 10);

    const [rows] = await connection
      .promise()
      .query("SELECT * FROM asistencias WHERE id_empleado = ? AND fecha = ?", [
        id_empleado,
        hoy,
      ]);

    if (rows.length === 0) {
      throw { message: "Primero debes registrar entrada" };
    }

    const asistencia = rows[0];

    if (asistencia.hora_salida) {
      throw { message: "Ya registraste tu salida hoy" };
    }

    await connection
      .promise()
      .query(
        "UPDATE asistencias SET hora_salida = NOW() WHERE id_asistencia = ?",
        [asistencia.id_asistencia],
      );

    return { message: "Salida registrada correctamente" };
  } catch (error) {
    console.error("ERROR SERVICE:", error);
    throw error;
  }
};

module.exports = {
  crearAsistencia,
  obtenerAsistencias,
  obtenerReporteMensual,
  obtenerSalarioMensual,
  actualizarAsistencia,
  obtenerResumenDashboard,
  eliminarAsistencia,
  registrarEntrada,
  registrarSalida,
};
