import {
  crearSolicitudSchema,
  aprobarSolicitudSchema,
  actualizarSolicitudSchema,
  consultarSolicitudesSchema,
} from "../validators/solicitud.schema.js";
import { crearError, detallarErroresZod } from "../utils/errores.js";

export const validarCreacionSolicitud = (req, res, next) => {
  const resultado = crearSolicitudSchema.safeParse(req.body)
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error)
    return next(
      crearError(
        "Los datos enviados para la solicitud son inválidos",
        400,
        detalles,
      ),
    )
  }
  req.body = resultado.data
  return next()
}

export const validarAprobacionSolicitud = (req, res, next) => {
  const resultado = aprobarSolicitudSchema.safeParse(req.body ?? {})
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error)
    return next(
      crearError(
        "Los datos enviados para aprobar la solicitud son inválidos",
        400,
        detalles,
      ),
    )
  }
  req.body = resultado.data
  return next()
}

export const validarActualizacionSolicitud = (req, res, next) => {
  const resultado = actualizarSolicitudSchema.safeParse(req.body)
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error)
    return next(
      crearError(
        "Los datos enviados para actualizar la solicitud son inválidos",
        400,
        detalles,
      ),
    )
  }
  req.body = resultado.data;
  return next()
}

export const validarConsultaSolicitudes = (req, res, next) => {
  const resultado = consultarSolicitudesSchema.safeParse(req.query)
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error)
    return next(
      crearError(
        "Los datos enviados para consultar las solicitudes son inválidos",
        400,
        detalles,
      ),
    )
  }
  req.consultaSolicitudes = resultado.data;
  return next()
}