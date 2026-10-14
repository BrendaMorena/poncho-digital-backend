import {
  crearSolicitudSchema,
  aprobarSolicitudSchema,
  rechazarSolicitudSchema,
  solicitarModificacionSchema,
  actualizarSolicitudSchema,
  consultarSolicitudesSchema,
} from "../../validators/solicitudes.schema.js";
import { validarSchemaBody, validarSchemaQuery } from "../base/validarSchema.js";

export const validarCreacionSolicitud = validarSchemaBody(crearSolicitudSchema, "crearSolicitudDTO", "Los datos enviados para la solicitud son inválidos");
export const validarAprobacionSolicitud = validarSchemaBody(aprobarSolicitudSchema, "aprobarSolicitudDTO", "Los datos enviados para aprobar la solicitud son inválidos");
export const validarRechazoSolicitud = validarSchemaBody(rechazarSolicitudSchema, "rechazarSolicitudDTO", "Los datos enviados para rechazar la solicitud son inválidos");
export const validarSolicitudModificacion = validarSchemaBody(solicitarModificacionSchema, "solicitarModificacionDTO", "Los datos enviados para solicitar modificaciones son inválidos");
export const validarActualizacionSolicitud = validarSchemaBody(actualizarSolicitudSchema, "actualizarSolicitudDTO", "Los datos enviados para actualizar la solicitud son inválidos");
export const validarConsultaSolicitudes = validarSchemaQuery(consultarSolicitudesSchema, "consultaSolicitudesDTO", "Los datos enviados para consultar las solicitudes son inválidos");