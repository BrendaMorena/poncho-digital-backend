import * as solicitudServices from "../services/solicitud.service.js";
import { crearError } from "../utils/errores.js";

export const crearSolicitud = async (req, res, next) => {
  try {
    const crearSolicitudDTO = req.body
    const nuevaSolicitud = await solicitudServices.crearSolicitud(crearSolicitudDTO)

    return res.status(201).json(nuevaSolicitud)
  } catch (error) {
    if (error.code === "P2003") {
      return next(
        crearError("El usuario o rubro indicado no existe en el sistema", 400)
      );
    }
    return next(error)
  }
}

export const obtenerSolicitudes = async (req, res, next) => {
  try {
    const criteriosConsulta = req.consultaSolicitudes
    const solicitudes = await solicitudServices.consultarSolicitudes(criteriosConsulta)
    return res.json(solicitudes)
  } catch (error) {
    return next(error)
  }
}

export const obtenerSolicitudPorId = async (req, res, next) => {
  try {
    const id = req.solicitudId
    const solicitud = await solicitudServices.obtenerSolicitudPorId(id)

    if (!solicitud) {
      return next(crearError(`No existe una solicitud con id ${req.solicitudId}`, 404))
    }

    return res.json(solicitud)
  } catch (error) {
    return next(error)
  }
}

export const aprobarSolicitud = async (req, res, next) => {
  try {
    const id = req.solicitudId
    const aprobarSolicitudDTO = req.body
    const resultado = await solicitudServices.aprobarSolicitud(id, aprobarSolicitudDTO)

    return res.json(resultado)
  } catch (error) {
    if (error.code === "P2002") {
      return next(
        crearError("El usuario de esta solicitud ya está registrado como artesano", 409)
      )
    }
    return next(error)
  }
}

export const actualizarSolicitud = async (req, res, next) => {
  try {
    const id = req.solicitudId
    const actualizarSolicitudDTO = req.body
    const solicitudActualizada = await solicitudServices.actualizarSolicitud(id, actualizarSolicitudDTO)

    return res.json(solicitudActualizada)
  } catch (error) {
    if (error.code === "P2025") {
      return next(crearError(`No existe una solicitud con id ${req.solicitudId}`, 404))
    }
    if (error.code === "P2003") {
      return next(
        crearError(`El rubro con id ${req.body.rubroId} no existe en el sistema`, 400)
      )
    }
    return next(error)
  }
}

export const eliminarSolicitud = async (req, res, next) => {
  try {
    const id = req.solicitudId
    await solicitudServices.eliminarSolicitud(id)

    return res.status(204).send()
  } catch (error) {
    if (error.code === "P2025") {
      return next(crearError(`No existe una solicitud con id ${req.solicitudId}`, 404))
    }
    return next(error)
  }
}