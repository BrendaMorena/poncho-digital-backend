import {
  pabellonSchema,
  actualizarPabellonSchema,
  consultarPabellonesSchema,
} from "../../validators/pabellones.schema.js";
import { validarSchemaBody, validarSchemaQuery } from "../base/validarSchema.js";

export const validarPabellon = validarSchemaBody(pabellonSchema, "crearPabellonDTO", "Los datos enviados para el pabellón son inválidos");
export const validarActualizarPabellon = validarSchemaBody(actualizarPabellonSchema, "actualizarPabellonDTO", "Los datos enviados para actualizar el pabellón son inválidos");
export const validarConsultaPabellones = validarSchemaQuery(consultarPabellonesSchema, "consultaPabellonesDTO", "Los datos enviados para consultar los pabellones son inválidos");
