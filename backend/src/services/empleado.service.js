const db = require("../config/db");

const obtenerEmpleados = (filtros) => {
  return new Promise((resolve, reject) => {
    let query = "SELECT * FROM empleados WHERE 1=1";
    const params = [];

    if (filtros.estado) {
      query += " AND estado = ?";
      params.push(filtros.estado);
    }

    if (filtros.departamento) {
      query += " AND departamento = ?";
      params.push(filtros.departamento);
    }

    db.query(query, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const crearEmpleado = (data) => {
  return new Promise((resolve, reject) => {
    const {
      nombre_completo,
      departamento,
      puesto,
      tipo_contrato,
      salario_base,
    } = data;

    // Validación básica
    if (!nombre_completo || !salario_base) {
      return reject({ message: "Datos obligatorios faltantes" });
    }

    const query = `
      INSERT INTO empleados 
      (nombre_completo, departamento, puesto, tipo_contrato, salario_base)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [nombre_completo, departamento, puesto, tipo_contrato, salario_base],
      (err, result) => {
        if (err) return reject(err);

        resolve({
          message: "Empleado creado",
          id: result.insertId,
        });
      },
    );
  });
};

const actualizarEmpleado = (id, data) => {
  return new Promise((resolve, reject) => {
    const {
      nombre_completo,
      departamento,
      puesto,
      tipo_contrato,
      salario_base,
    } = data;

    const query = `
      UPDATE empleados 
      SET nombre_completo = ?, departamento = ?, puesto = ?, tipo_contrato = ?, salario_base = ?
      WHERE id_empleado = ?
    `;

    db.query(
      query,
      [nombre_completo, departamento, puesto, tipo_contrato, salario_base, id],
      (err, result) => {
        if (err) return reject(err);

        if (result.affectedRows === 0) {
          return reject({ message: "Empleado no encontrado" });
        }

        resolve({ message: "Empleado actualizado" });
      },
    );
  });
};

const eliminarEmpleado = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE empleados 
      SET estado = 'inactivo'
      WHERE id_empleado = ?
    `;

    db.query(query, [id], (err, result) => {
      if (err) return reject(err);

      if (result.affectedRows === 0) {
        return reject({ message: "Empleado no encontrado" });
      }

      resolve({ message: "Empleado desactivado" });
    });
  });
};

const cambiarEstadoEmpleado = (id, estado) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE empleados
      SET estado = ?
      WHERE id_empleado = ?
    `;

    db.query(query, [estado, id], (err, result) => {
      if (err) return reject(err);

      if (result.affectedRows === 0) {
        return reject({ message: "Empleado no encontrado" });
      }

      resolve({ message: "Estado actualizado" });
    });
  });
};

module.exports = {
  obtenerEmpleados,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
  cambiarEstadoEmpleado,
};
