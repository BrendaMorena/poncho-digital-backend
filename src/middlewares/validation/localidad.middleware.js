import {
  crearLocalidadSchema,
  actualizarLocalidadSchema,
  consultarLocalidadesSchema,
} from "../../validators/localidad.schema.js";
import { validarSchemaBody, validarSchemaQuery } from "../base/validarSchema.js";

export const validarCreacionLocalidad = validarSchemaBody(crearLocalidadSchema, "crearLocalidadDTO", "Los datos enviados para crear la localidad son inválidos");
export const validarActualizacionLocalidad = validarSchemaBody(actualizarLocalidadSchema, "actualizarLocalidadDTO", "Los datos enviados para actualizar la localidad son inválidos");
export const validarConsultaLocalidades = validarSchemaQuery(consultarLocalidadesSchema, "consultaLocalidadesDTO", "Los parámetros de consulta de localidades son inválidos");
