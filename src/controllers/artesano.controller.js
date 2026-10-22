import { crearError } from '../utils/errores.js';
import * as artesanoService from "../services/artesano.service.js";



export const obtenerArtesanos = async (req, res, next) => {
  try {
    const criteriosConsulta = req.consultaArtesanosDTO; 
    const artesanos = await artesanoService.obtenerArtesanos(criteriosConsulta);
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

export const obtenerMiArtesano = async (req, res, next) => {
  try {
    const usuarioId = req.contextoUsuario.id_usuario;
    const artesano = await artesanoService.obtenerMiArtesano(usuarioId);
    return res.status(200).json(artesano);
  } catch (error) {
    if (error.code === "P2025") {
      return next(crearError("No posee un perfil de artesano registrado en el sistema.", 404));
    }
    return next(error);
  }
};

export const crearArtesano = async (req, res, next) => {
  try {
    const crearArtesanoDTO = req.crearArtesanoDTO;
    const nuevoArtesano = await artesanoService.crearArtesano(crearArtesanoDTO);
    return res.status(201).json(nuevoArtesano);
  } catch (error) {
    if (error.code === "P2002") {
      return next(crearError("Este usuario ya se encuentra registrado como artesano", 409));
    }
    return next(error);
  }
};

export const actualizarArtesano = async (req, res, next) => {
  try {
    const idArtesano = req.artesanoId; 
    const actualizarArtesanoDTO = req.actualizarArtesanoDTO; 
    
    const artesanoActualizado = await artesanoService.actualizarArtesano(idArtesano, actualizarArtesanoDTO);
    
    return res.json(artesanoActualizado);
  } catch (error) {
    return next(error);
  }
};

export const actualizarMiArtesano = async (req, res, next) => {
  try {
    const usuarioId = req.contextoUsuario.id_usuario;
    const actualizarArtesanoDTO = req.actualizarArtesanoDTO;
    const artesanoActualizado = await artesanoService.actualizarMiArtesano(usuarioId, actualizarArtesanoDTO);
    return res.status(200).json(artesanoActualizado);
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