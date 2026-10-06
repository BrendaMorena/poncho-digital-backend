import * as busquedaService from "../services/busqueda.service.js";
import { crearError } from "../utils/errores.js";

export const crearBusqueda = async (req, res, next) => {
  try {
    const nuevaBusqueda = await busquedaService.crearBusqueda(req.body);
    return res.status(201).json(nuevaBusqueda);
  } catch (error) {
    return next(error);
  }
};

export const obtenerBusquedas = async (req, res, next) => {
  try {
    const resultado = await busquedaService.consultarBusquedas(req.valoresBusqueda);
    return res.status(200).json(resultado);
  } catch (error) {
    return next(error);
  }
};

export const obtenerBusquedaPorId = async (req, res, next) => {
  try {
    const id = req.busquedaId; 
    const busqueda = await busquedaService.obtenerBusquedaPorId(id);
    if (!busqueda) {
      return next(crearError(`No existe una búsqueda con id ${id}`, 404));
    }
    return res.status(200).json(busqueda);
  } catch (error) {
    return next(error);
  }
};
export const eliminarBusqueda = async (req, res, next) => {
  try {
    const id = req.busquedaId; 
    await busquedaService.eliminarBusqueda(id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};