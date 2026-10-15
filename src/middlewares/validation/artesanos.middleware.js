import { 
  crearArtesanoSchema, 
  actualizarArtesanoSchema, 
  consultarArtesanosSchema 
} from "../../validators/artesanos.schema.js";
import { validarSchemaBody, validarSchemaQuery } from "../base/validarSchema.js";

export const validarCreacionArtesano = validarSchemaBody(crearArtesanoSchema, "crearArtesanoDTO", "Los datos enviados para crear el artesano son inválidos");
export const validarActualizarArtesano = validarSchemaBody(actualizarArtesanoSchema, "actualizarArtesanoDTO", "Los datos enviados para actualizar el artesano son inválidos");
export const validarConsultaArtesanos = validarSchemaQuery(consultarArtesanosSchema, "consultaArtesanosDTO", "Los parámetros de consulta de artesanos son inválidos");