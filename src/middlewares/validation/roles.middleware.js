import {
  rolSchema,
  actualizarRolSchema,
  consultarRolesSchema,
} from "../../validators/roles.schema.js";
import { validarSchemaBody, validarSchemaQuery } from "../base/validarSchema.js";


export const validarRol = validarSchemaBody(rolSchema, "crearRolDTO", "Los datos enviados para el rol son inválidos");
export const validarActualizarRol = validarSchemaBody(actualizarRolSchema, "actualizarRolDTO", "Los datos enviados para actualizar el rol son inválidos");
export const validarConsultaRoles = validarSchemaQuery(consultarRolesSchema, "consultaRolesDTO", "Los datos enviados para consultar los roles son inválidos");

