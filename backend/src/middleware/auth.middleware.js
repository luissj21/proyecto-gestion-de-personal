const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], "SECRETO_SUPER_SEGURO");
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Token inválido" });
  }
};

const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    next();
  };
};

module.exports = {
  verificarToken,
  verificarRol,
};
