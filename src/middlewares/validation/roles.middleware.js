import { crearError } from "../../utils/errores.js";
import {
  rolSchema,
  actualizarRolSchema,
  consultarRolesSchema,
} from "../../validators/roles.schema.js";
import { validarSchemaBody, validarSchemaQuery } from "../base/validarSchema.js";

export const soloAdmin = (req, res, next) => {
  // Asumimos que el sistema de login ya metió los datos en req.usuario
  if (!req.usuario || req.usuario.rolId !== 1) {
    return next(crearError("Acceso denegado. Acción exclusiva del Admin.", 403));
  }
  next();
};


export const organizadoresAdmins = (req, res, next) => {
  if (!req.usuario || (req.usuario.rolId !== 1 && req.usuario.rolId !== 2)) {
    return next(crearError("Acceso denegado. Requiere permisos de administración.", 403));
  }
  next();
};

export const validarRol = validarSchemaBody(rolSchema, "crearRolDTO", "Los datos enviados para el rol son inválidos");
export const validarActualizarRol = validarSchemaBody(actualizarRolSchema, "actualizarRolDTO", "Los datos enviados para actualizar el rol son inválidos");
export const validarConsultaRoles = validarSchemaQuery(consultarRolesSchema, "consultaRolesDTO", "Los datos enviados para consultar los roles son inválidos");

