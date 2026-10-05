import { crearError } from "../utils/errores.js";


export const soloAdmin = (req, res, next) => {
  // Asumimos que el sistema de login ya metió los datos en req.usuario
  if (req.usuario.rolId !== 1) {
    return next(crearError("Acceso denegado. Acción exclusiva del Admin.", 403));
  }
  next();
};


export const organizadoresAdmins = (req, res, next) => {
  if (req.usuario.rolId !== 1 && req.usuario.rolId !== 2) {
    return next(crearError("Acceso denegado. Requiere permisos de administración.", 403));
  }
  next();
};