import {
  standSchema,
  actualizarStandSchema,
  consultarStandsSchema,
  asignarStandSchema,
} from "../../validators/stands.schema.js";
import { validarSchemaBody, validarSchemaQuery } from "../base/validarSchema.js";

export const validarStand = validarSchemaBody(standSchema, "crearStandDTO", "Los datos enviados para el stand son inválidos");
export const validarActualizarStand = validarSchemaBody(actualizarStandSchema, "actualizarStandDTO", "Los datos enviados para actualizar el stand son inválidos");
export const validarConsultaStands = validarSchemaQuery(consultarStandsSchema, "consultaStandsDTO", "Los datos enviados para consultar el stand son inválidos");
export const validarAsignarStand = validarSchemaBody(asignarStandSchema, "asignarStandDTO", "Los datos enviados para la asignación del stand son inválidos");

