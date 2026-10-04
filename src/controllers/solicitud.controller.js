import * as solicitudServices from "../services/solicitud.service.js";
import { crearError } from "../utils/errores.js";

export const crearSolicitud = async (req, res, next) => {
  try {
    const crearSolicitudDTO = req.body;
    const nuevaSolicitud = await solicitudServices.crearSolicitud(crearSolicitudDTO);

    return res.status(201).json({
      mensaje: "Solicitud registrada con éxito en estado PENDIENTE",
      solicitud: nuevaSolicitud,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return next(
        crearError("Este usuario ya tiene una solicitud registrada en el sistema", 409)
      );
    }
    if (error.code === "P2003") {
      return next(
        crearError("El usuario o rubro indicado no existe en el sistema", 400)
      );
    }
    return next(error);
  }
};

export const obtenerSolicitudes = async (req, res, next) => {
  try {
    const criteriosConsulta = req.consultaSolicitudes;
    const resultado = await solicitudServices.consultarSolicitudes(criteriosConsulta);
    return res.json(resultado);
  } catch (error) {
    return next(error);
  }
};

export const obtenerSolicitudPorId = async (req, res, next) => {
  try {
    const id = req.solicitudId;
    const solicitud = await solicitudServices.obtenerSolicitudPorId(id);

    if (!solicitud) {
      return next(crearError(`No existe una solicitud con id ${id}`, 404));
    }

    return res.json(solicitud);
  } catch (error) {
    return next(error);
  }
};

export const aprobarSolicitud = async (req, res, next) => {
  try {
    const id = req.solicitudId;
    const resultado = await solicitudServices.aprobarSolicitud(id, req.body);

    return res.status(200).json(resultado);
  } catch (error) {
    if (error.code === "P2002") {
      return next(
        crearError("El usuario ya está registrado como artesano o el stand ya fue ocupado", 409)
      );
    }
    return next(error);
  }
};

export const rechazarSolicitud = async (req, res, next) => {
  try {
    const id = req.solicitudId;
    const resultado = await solicitudServices.rechazarSolicitud(id, req.body);

    return res.status(200).json(resultado);
  } catch (error) {
    return next(error);
  }
};

export const solicitarModificacion = async (req, res, next) => {
  try {
    const id = req.solicitudId;
    const resultado = await solicitudServices.solicitarModificacion(id, req.body);

    return res.status(200).json(resultado);
  } catch (error) {
    return next(error);
  }
};

export const actualizarSolicitud = async (req, res, next) => {
  try {
    const id = req.solicitudId;
    const resultado = await solicitudServices.actualizarSolicitud(id, req.body);

    return res.status(200).json(resultado);
  } catch (error) {
    if (error.code === "P2025") {
      return next(crearError(`No existe una solicitud con id ${req.solicitudId}`, 404));
    }
    if (error.code === "P2003") {
      return next(
        crearError(`El rubro con id ${req.body.rubroId} no existe en el sistema`, 400)
      );
    }
    return next(error);
  }
};

export const eliminarSolicitud = async (req, res, next) => {
  try {
    const id = req.solicitudId;
    await solicitudServices.eliminarSolicitud(id);

    return res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return next(crearError(`No existe una solicitud con id ${req.solicitudId}`, 404));
    }
    return next(error);
  }
};