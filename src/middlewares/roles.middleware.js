import { crearError } from "../utils/errores.js";
import {
  rolSchema,
  actualizarRolSchema,
  consultarRolesSchema,
} from "../validators/roles.schema.js";
import { crearError, detallarErroresZod } from "../utils/errores.js";

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



export const validarRol = (req, res, next) => {
  const resultado = rolSchema.safeParse(req.body);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError(
        "Los datos enviados para el rol son inválidos",
        400,
        detalles
      )
    );
  }
  req.body = resultado.data;
  return next();
};

export const validarActualizarRol = (req, res, next) => {
  const resultado = actualizarRolSchema.safeParse(req.body);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError(
        "Los datos enviados para actualizar el rol son inválidos",
        400,
        detalles
      )
    );
  }
  req.body = resultado.data;
  return next();
};

export const validarConsultaRoles = (req, res, next) => {
  const resultado = consultarRolesSchema.safeParse(req.query);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError(
        "Los datos enviados para consultar los roles son inválidos",
        400,
        detalles
      )
    );
  }
  req.consultaRoles = resultado.data;
  return next();
};

