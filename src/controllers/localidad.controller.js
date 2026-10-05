import * as localidadService from "../services/localidad.service.js";
import { crearError } from "../utils/errores.js";

export const crearLocalidad = async (req, res, next) => {
  try {
    const nuevaLocalidad = await localidadService.crearLocalidad(req.body);
    return res.status(201).json(nuevaLocalidad,);
  } catch (error) {
    if (error.code === "P2002") {
      return next(
        crearError(`Ya existe una localidad con el nombre '${req.body.nombre_locacion}'`, 409)
      );
    }
    return next(error);
  }
};

export const obtenerLocalidades = async (req, res, next) => {
  try {
    const resultado = await localidadService.consultarLocalidades(req.consultaLocalidades);
    return res.json(resultado);
  } catch (error) {
    return next(error);
  }
};

export const obtenerLocalidadPorId = async (req, res, next) => {
  try {
    const id = req.localidadId;
    const localidad = await localidadService.obtenerLocalidadPorId(id);

    if (!localidad) {
      return next(crearError(`No existe una localidad con id ${id}`, 404));
    }

    return res.json(localidad);
  } catch (error) {
    return next(error);
  }
};

export const actualizarLocalidad = async (req, res, next) => {
  try {
    const id = req.localidadId;
    const localidadActualizada = await localidadService.actualizarLocalidad(id, req.body);

    return res.json(localidadActualizada);
  } catch (error) {
    if (error.code === "P2025") {
      return next(crearError(`No existe una localidad con id ${req.localidadId}`, 404));
    }
    if (error.code === "P2002") {
      return next(
        crearError(`Ya existe una localidad con el nombre '${req.body.nombre_locacion}'`, 409)
      );
    }
    return next(error);
  }
};

export const eliminarLocalidad = async (req, res, next) => {
  try {
    const id = req.localidadId;
    await localidadService.eliminarLocalidad(id);

    return res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return next(crearError(`No existe una localidad con id ${req.localidadId}`, 404));
    }
    if (error.code === "P2003") {
      return next(
        crearError("No se puede eliminar la localidad porque tiene registros asociados", 400)
      );
    }
    return next(error);
  }
};
