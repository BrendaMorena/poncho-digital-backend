import { crearError } from "../utils/errores.js";
import * as sectorService from "../services/sector.service.js";

export const obtenerSectores = async (req, res, next) => {
  try {
    const criteriosConsulta = req.consultaSectores;
    const resultado = await sectorService.obtenerSectores(criteriosConsulta);
    return res.json(resultado);
  } catch (error) {
    return next(error);
  }
};

export const obtenerSectorPorId = async (req, res, next) => {
  try {
    const sector = await sectorService.obtenerSectorPorId(req.sectorId);
    if (!sector) {
      return next(
        crearError(`No existe el Sector con id ${req.sectorId}`, 404)
      );
    }
    return res.status(200).json(sector);
  } catch (error) {
    return next(error);
  }
};

export const crearSector = async (req, res, next) => {
  try {
    const crearSectorDTO = req.body;
    const nuevoSector = await sectorService.crearSector(crearSectorDTO);

    return res.status(201).json(nuevoSector);
  } catch (error) {
    if (error.code === "P2002") {
      return next(
        crearError(`El sector con ese ${campo} ya existe en el sistema`, 409)
      );
    }
    return next(error);
  }
};

export const actualizarSector = async (req, res, next) => {
  try {
    const sectorId = req.sectorId;
    const actualizarSectorDTO = req.body;
    const sectorActualizado = await sectorService.actualizarSector(
      sectorId,
      actualizarSectorDTO
    );

    return res.json(sectorActualizado);
  } catch (error) {
    if (error.code === "P2002") {
      return next(
        crearError(`El ${campo} del sector ya está en uso`, 409)
      );
    }
    return next(error);
  }
};

export const eliminarSector = async (req, res, next) => {
  try {
    const sectorId = req.sectorId;
    await sectorService.eliminarSector(sectorId);

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
