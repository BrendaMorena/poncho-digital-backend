import { crearError } from '../utils/errores.js';
import prisma from '../config/prisma.js';
import * as artesanoService from "../services/artesano.service.js";

export const obtenerArtesanos = async (req, res, next) => {
  try {
    const artesanos = await artesanoService.obtenerArtesanos();
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
      return next(crearError(`El Stand ${req.body.numero_stand} ya existe en el sistema`, 409))
    }
    return next(error)
};
  

export const actualizarArtesano = async (req, res, next) => {
  try {
    const idArtesano = req.artesanoId; // Obtenido de tu middleware validarId
    const dto = req.body; // Esto ya fue validado por Zod
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
    
    // Llamamos al servicio (no devuelve nada, solo ejecuta)
    await artesanoService.eliminarArtesano(idArtesano);
    
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
