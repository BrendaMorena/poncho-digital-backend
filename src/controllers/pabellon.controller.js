import { crearError } from "../utils/errores.js";
import * as pabellonService from "../services/pabellon.service.js";

export const obtenerPabellones = async (req, res, next) => {
  try {
    const criteriosConsulta = req.consultaPabellones;
    const resultado = await pabellonService.obtenerPabellones(criteriosConsulta);
    return res.json(resultado);
  } catch (error) {
    return next(error);
  }
};

export const obtenerPabellonPorId = async (req, res, next) => {
  try {
    const pabellon = await pabellonService.obtenerPabellonPorId(req.pabellonId);
    if (!pabellon) {
      return next(
        crearError(`No existe el Pabellón con id ${req.pabellonId}`, 404)
      );
    }
    return res.status(200).json(pabellon);
  } catch (error) {
    return next(error);
  }
};

export const crearPabellon = async (req, res, next) => {
  try {
    const crearPabellonDTO = req.body;
    const nuevoPabellon = await pabellonService.crearPabellon(crearPabellonDTO);

    return res.status(201).json(nuevoPabellon);
  } catch (error) {
    if (error.code === "P2002") {
      return next(
        crearError(
          `El Pabellón "${req.body.nombre_pabellon}" ya existe en el sistema`,
          409
        )
      );
    }
    return next(error);
  }
};

export const actualizarPabellon = async (req, res, next) => {
  try {
    const pabellonId = req.pabellonId;
    const actualizarPabellonDTO = req.body;
    const pabellonActualizado = await pabellonService.actualizarPabellon(
      pabellonId,
      actualizarPabellonDTO
    );

    return res.json(pabellonActualizado);
  } catch (error) {
    if (error.code === "P2002") {
      return next(
        crearError(
          `El nombre de pabellón "${req.body.nombre_pabellon}" ya está en uso`,
          409
        )
      );
    }
    return next(error);
  }
};

export const eliminarPabellon = async (req, res, next) => {
  try {
    const pabellonId = req.pabellonId;
    await pabellonService.eliminarPabellon(pabellonId);

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
