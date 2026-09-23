import { crearError } from '../utils/errores.js';
import prisma from '../config/prisma.js';
import * as artesanoService from "../services/artesano.service.js";
import { consultarArtesanosSchema } from "../validators/artesanos.schemas.js";
import { ZodError } from 'zod';

export const obtenerArtesanos = async (req, res, next) => {
  try {
    const { page, limit, sortBy, sortOrder } = req.consultaArtesanos;
    const artesanos = await artesanoService.obtenerArtesanos(page, limit, sortBy, sortOrder);
    return res.status(200).json(artesanos);
   
  } catch (error) {
    next(error); 
  }
};



export const obtenerArtesanoPorId = async (req, res, next) => {
try{
  const idArtesano = req.artesanoId;

  const artesano = await artesanoService.obtenerArtesanoPorId(idArtesano);
    if (!artesano) {
      return next(crearError("El artesano no existe.", 404));
}
  
    return res.json(artesano);
  }catch (error) {
    return next(error);}
};


export const crearArtesano = async (req, res, next) => {
  try{
    const crearArtesanoDTO = req.body;
    const nuevoArtesano = await artesanoService.crearArtesano(crearArtesanoDTO);
    
  return res.status(201).json(nuevoArtesano);
  }catch (error) {
    if(error.code === "P2002"){
      return next(crearError(`El Artesano ya existe en el sistema`, 409))
    }
    return next(error)
  }
};

  

export const actualizarArtesano = async (req, res, next) => {
  try {
    const idArtesano = req.artesanoId; 
    const dto = req.body; 
    // Llamamos al servicio
    const artesanoActualizado = await artesanoService.actualizarArtesano(idArtesano, dto);
    
    return res.json(artesanoActualizado);
  } catch (error) {
    return next(error);
  }
};
export const eliminarArtesano = async (req, res, next) => {
  try {
    const idArtesano = req.artesanoId; 
    
    await artesanoService.eliminarArtesano(idArtesano);
    
    return res.status(200).json({ mensaje: "Artesano eliminado exitosamente" });
  } catch (error) {
    return next(error);
  }
};
