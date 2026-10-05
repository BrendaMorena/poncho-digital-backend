import {
  crearSolicitudSchema,
  aprobarSolicitudSchema,
  rechazarSolicitudSchema,
  solicitarModificacionSchema,
  actualizarSolicitudSchema,
  consultarSolicitudesSchema,
} from "../validators/solicitudes.schema.js";
import { crearError, detallarErroresZod } from "../utils/errores.js";

export const validarCreacionSolicitud = (req, res, next) => {
  const resultado = crearSolicitudSchema.safeParse(req.body);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError("Los datos enviados para la solicitud son inválidos", 400, detalles)
    );
  }
  req.body = resultado.data;
  return next();
};

export const validarAprobacionSolicitud = (req, res, next) => {
  const resultado = aprobarSolicitudSchema.safeParse(req.body ?? {});
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError("Los datos enviados para aprobar la solicitud son inválidos", 400, detalles)
    );
  }
  req.body = resultado.data;
  return next();
};

export const validarRechazoSolicitud = (req, res, next) => {
  const resultado = rechazarSolicitudSchema.safeParse(req.body);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError("Los datos enviados para rechazar la solicitud son inválidos", 400, detalles)
    );
  }
  req.body = resultado.data;
  return next();
};

export const validarSolicitudModificacion = (req, res, next) => {
  const resultado = solicitarModificacionSchema.safeParse(req.body);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError("Los datos enviados para solicitar modificaciones son inválidos", 400, detalles)
    );
  }
  req.body = resultado.data;
  return next();
};

export const validarActualizacionSolicitud = (req, res, next) => {
  const resultado = actualizarSolicitudSchema.safeParse(req.body);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError("Los datos enviados para actualizar la solicitud son inválidos", 400, detalles)
    );
  }
  req.body = resultado.data;
  return next();
};

export const validarConsultaSolicitudes = (req, res, next) => {
  const resultado = consultarSolicitudesSchema.safeParse(req.query);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError("Los datos enviados para consultar las solicitudes son inválidos", 400, detalles)
    );
  }
  req.consultaSolicitudes = resultado.data;
  return next();
};