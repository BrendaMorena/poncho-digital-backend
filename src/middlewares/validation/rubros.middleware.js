import {
  crearRubroSchema,
  actualizarRubroSchema,
} from "../../validators/rubros.schema.js";
import { validarSchemaBody } from "../base/validarSchema.js";

export const mensajeError = "Los datos enviados para el rubro son inválidos";

export const validarCreacionRubro = validarSchemaBody(crearRubroSchema, "crearRubroDTO", mensajeError);
export const validarActualizarRubro = validarSchemaBody(actualizarRubroSchema, "actualizarRubroDTO", mensajeError);