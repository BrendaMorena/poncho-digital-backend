import { crearError } from "../utils/errores.js";
import * as rolService from "../services/rol.service.js";

export const obtenerRoles = async (req, res, next) => {
  try {
    const criteriosConsulta = req.consultaRoles;
    const resultado = await rolService.obtenerRoles(criteriosConsulta);
    return res.json(resultado);
  } catch (error) {
    return next(error);
  }
};

export const obtenerRolPorId = async (req, res, next) => {
  try {
    const rol = await rolService.obtenerRolPorId(req.rolId);
    if (!rol) {
      return next(
        crearError(`No existe el Rol con id ${req.rolId}`, 404)
      );
    }
    return res.status(200).json(rol);
  } catch (error) {
    return next(error);
  }
};

export const crearRol = async (req, res, next) => {
  try {
    const crearRolDTO = req.body;
    const nuevoRol = await rolService.crearRol(crearRolDTO);

    return res.status(201).json(nuevoRol);
  } catch (error) {
    if (error.code === "P2002") {
      return next(
        crearError(
          `El Rol "${req.body.nombre}" ya existe en el sistema`,
          409
        )
      );
    }
    return next(error);
  }
};

export const actualizarRol = async (req, res, next) => {
  try {
    const rolId = req.rolId;
    const actualizarRolDTO = req.body;
    const rolActualizado = await rolService.actualizarRol(
      rolId,
      actualizarRolDTO
    );

    return res.json(rolActualizado);
  } catch (error) {
    if (error.code === "P2002") {
      return next(
        crearError(
          `El nombre de rol "${req.body.nombre}" ya está en uso`,
          409
        )
      );
    }
    return next(error);
  }
};

export const eliminarRol = async (req, res, next) => {
  try {
    const rolId = req.rolId;
    await rolService.eliminarRol(rolId);

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
