import { crearError } from "../utils/errores.js";
import * as rubroService from "../services/rubro.service.js";

export const obtenerRubros = async (req, res, next) => {
  try {
    const rubros = await rubroService.obtenerRubros();
    return res.status(200).json(rubros);
  } catch (error) {
    next(error);
  }
};

export const obtenerRubroPorId = async (req, res, next) => {
  try {
    const id = req.rubroId; 
    const rubro = await rubroService.obtenerRubroPorId(id);
    
    if (!rubro) {
      return next(crearError("El rubro no existe", 404));
    }
    return res.status(200).json(rubro);
  } catch (error) {
    next(error);
  }
};

export const crearRubro = async (req, res, next) => {
  try {
    const dto = req.body;
    const nuevoRubro = await rubroService.crearRubro(dto);
    return res.status(201).json(nuevoRubro);
  } catch (error) {
    if (error.code === "P2002") {
      return next(crearError("Ya existe una categoría con ese nombre", 409));
    }
    next(error);
  }
};

export const actualizarRubro = async (req, res, next) => {
  try {
    const id = req.rubroId; 
    const dto = req.body;
    const rubroActualizado = await rubroService.actualizarRubro(id, dto);
    return res.status(200).json(rubroActualizado);
  } catch (error) {
    if (error.code === "P2002") {
      return next(crearError("Ya existe otra categoría con ese nombre", 409));
    }
    next(error);
  }
};

export const eliminarRubro = async (req, res, next) => {
  try {
    const id = req.rubroId; 
    await rubroService.eliminarRubro(id);
    return res.status(200).json({ mensaje: "Rubro eliminado exitosamente" });
  } catch (error) {
    
    if (error.code === "P2003") {
      return next(crearError("No se puede eliminar este rubro porque hay artesanos o solicitudes que lo están usando", 409));
    }
    next(error);
  }
};