import prisma from "../../config/prisma.js";
import { crearError } from "../../utils/errores.js";
import { obtenerUsuarioPorId } from "../../services/usuario.service.js"


export const cargarContextoUsuario = async (req, res, next) => {
  const usuario = await obtenerUsuarioPorId(req.usuario.id);
  if (!usuario) {
    res.set("WWW-Authenticate", "Bearer");
    return res.status(401).json({ mensaje: "Cuenta inexistente." });
  }
  if (!usuario.activo) {
    return res.status(403).json({ mensaje: "Cuenta inactiva." });
  }
  req.contextoUsuario = usuario;
  return next();
};

export const autorizarRoles = (...rolesPermitidos) => (req, res, next) => {
  const usuario = req.contextoUsuario;
  const nombreRol = typeof usuario?.rol === "string" ? usuario.rol : usuario?.rol?.nombre;

  if (!nombreRol || !rolesPermitidos.includes(nombreRol)) {
    return next(crearError("Acceso denegado: no posee los permisos requeridos.", 403));
  }

  return next();
};

export const soloAdmin = autorizarRoles("ADMINISTRADOR");
export const organizadoresYAdmins = autorizarRoles("ADMINISTRADOR", "ORGANIZADOR");
export const soloArtesano = autorizarRoles("ARTESANO");

