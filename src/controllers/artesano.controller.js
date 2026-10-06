import { crearError } from '../utils/errores.js';
import * as artesanoService from "../services/artesano.service.js";



export const obtenerArtesanos = async (req, res, next) => {
  try {
    const artesanos = await artesanoService.obtenerArtesanos(req.consultaArtesanos);
    return res.json(artesanos);
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



export const actualizarArtesano = async (req, res, next) => {
  try {
    const idArtesano = req.artesanoId; 
    const actualizarArtesanoDTO = req.body; 
    // Llamamos al servicio
    const artesanoActualizado = await artesanoService.actualizarArtesano(idArtesano, actualizarArtesanoDTO);
    
    return res.json(artesanoActualizado);
  } catch (error) {
    return next(error);
  }
};

export const eliminarArtesano = async (req, res, next) => {
  try {
    const idArtesano = req.artesanoId; 
    
    await artesanoService.eliminarArtesano(idArtesano);
    return res.status(200).json({ mensaje: "Artesano dado de baja exitosamente" });
  } catch (error) {
    return next(error);
  }
};