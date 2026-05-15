const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTRO

const registrarUsuario = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email, password, rol, id_empleado } = data;

      if (!email || !password || !rol) {
        return reject({ message: "Campos obligatorios faltantes" });
      }

      if (rol === "empleado" && !id_empleado) {
        return reject({ message: "Empleado requiere id_empleado" });
      }

      const idEmpleadoFinal = id_empleado ? parseInt(id_empleado) : null;

      const password_hash = await bcrypt.hash(password, 10);

      const query = `
        INSERT INTO usuarios (email, password_hash, rol, id_empleado)
        VALUES (?, ?, ?, ?)
      `;

      db.query(
        query,
        [email, password_hash, rol, idEmpleadoFinal],
        (err, result) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              return reject({ message: "El correo ya está registrado" });
            }
            return reject(err);
          }

          resolve({
            message: "Usuario creado correctamente",
          });
        },
      );
    } catch (error) {
      reject(error);
    }
  });
};

const loginUsuario = async ({ email, password }) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM usuarios WHERE email = ?`;

    db.query(query, [email], async (err, results) => {
      if (err) return reject(err);

      if (results.length === 0) {
        return reject({ message: "Usuario no encontrado" });
      }

      const user = results[0];

      if (user.estado === "inactivo") {
        return reject({ message: "Usuario inactivo" });
      }

      const match = await bcrypt.compare(password, user.password_hash);

      if (!match) {
        return reject({ message: "Contraseña incorrecta" });
      }

      const token = jwt.sign(
        {
          id: user.id_usuario,
          rol: user.rol,
          id_empleado: user.id_empleado,
        },
        "SECRETO_SUPER_SEGURO",
        { expiresIn: "8h" },
      );

      resolve({
        message: "Login exitoso",
        token,
        usuario: {
          id: user.id_usuario,
          email: user.email,
          rol: user.rol,
          id_empleado: user.id_empleado,
        },
      });
    });
  });
};

// const registrarUsuario = (data) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const { email, password, rol, id_empleado } = data;

//       if (!email || !password || !rol) {
//         return reject({ message: "Campos obligatorios faltantes" });
//       }

//       const password_hash = await bcrypt.hash(password, 10);
//       const id_empleado_int = parseInt(id_empleado);

//       const query = `
//         INSERT INTO usuarios (email, password_hash, rol, id_empleado)
//         VALUES (?, ?, ?, ?)
//       `;

//       db.query(
//         query,
//         [email, password_hash, rol, id_empleado_int],
//         (err, result) => {
//           if (err) return reject(err);

//           resolve({
//             message: "Usuario creado correctamente",
//           });
//         },
//       );
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

// // LOGIN
// const loginUsuario = async ({ email, password }) => {
//   return new Promise((resolve, reject) => {
//     const query = `SELECT * FROM usuarios WHERE email = ?`;

//     db.query(query, [email], async (err, results) => {
//       if (err) return reject(err);

//       if (results.length === 0) {
//         return reject({ message: "Usuario no encontrado" });
//       }

//       const user = results[0];

//       const match = await bcrypt.compare(password, user.password_hash);

//       if (!match) {
//         return reject({ message: "Contraseña incorrecta" });
//       }
//       console.log("USER LOGIN:", user);
//       const token = jwt.sign(
//         {
//           id: user.id_usuario,
//           rol: user.rol,
//           id_empleado: user.id_empleado,
//         },
//         "SECRETO_SUPER_SEGURO",
//         { expiresIn: "8h" },
//       );

//       resolve({
//         message: "Login exitoso",
//         token,
//         usuario: {
//           id: user.id_usuario,
//           email: user.email,
//           rol: user.rol,
//           id_empleado: user.id_empleado,
//         },
//       });
//     });
//   });
// };

//  Obtener usuarios
const obtenerUsuarios = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        u.id_usuario AS id,
        u.email,
        u.rol,
        u.id_empleado,
        e.nombre_completo
      FROM usuarios u
      LEFT JOIN empleados e ON u.id_empleado = e.id_empleado
    `;

    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

//  Actualizar usuario
const actualizarUsuario = (id, data) => {
  return new Promise(async (resolve, reject) => {
    const { email, password, rol, id_empleado } = data;

    let password_hash = null;

    if (password) {
      password_hash = await bcrypt.hash(password, 10);
    }

    const query = password
      ? `
      UPDATE usuarios 
      SET email = ?, password_hash = ?, rol = ?, id_empleado = ?
      WHERE id_usuario = ?
    `
      : `
      UPDATE usuarios 
      SET email = ?, rol = ?, id_empleado = ?
      WHERE id_usuario = ?
    `;

    const params = password
      ? [email, password_hash, rol, id_empleado || null, id]
      : [email, rol, id_empleado || null, id];

    db.query(query, params, (err, result) => {
      if (err) return reject(err);

      resolve({ message: "Usuario actualizado" });
    });
  });
};

//  Eliminar usuario
const eliminarUsuario = (id) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM usuarios WHERE id_usuario = ?";

    db.query(query, [id], (err, result) => {
      if (err) return reject(err);

      resolve({ message: "Usuario eliminado" });
    });
  });
};

module.exports = {
  registrarUsuario,
  loginUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
};
