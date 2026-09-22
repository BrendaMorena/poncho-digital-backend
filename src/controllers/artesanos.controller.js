import {artesanos} from '../data/artesanos.js';
import { crearError } from '../utils/errores.js';
//import { siguienteId } from '../utils/siguienteId.js';
import prisma from '../config/prisma.js';


export const obtenerArtesanos = async (req, res, next) => {
  try {
    const artesanos = await prisma.artesano.findMany({
      
      include: {
        usuario: { 
          select: { // Elegimos qué campos del usuario queremos mostrar
            nombre: true,
            apellido: true,
            email: true,
            localidad: true,
            telefono: true
          }
        },
        rubro: true 
      }
    });
    return res.status(200).json(artesanos);
  } catch (error) {
    next(error); 
  }
};


export const obtenerArtesanoPorId = async (req, res, next) => {
try{
  const artesanoId = Number(req.params.id);
  if (!Number.isInteger(artesanoId) || artesanoId <= 0) {
    return next(crearError("El identificador del artesano debe ser un entero positivo.", 400));
  }

  const artesano = await prisma.artesano.findUnique({
    where: { id_artesano: artesanoId },
    include: {
      usuario: { 
        select: { 
          nombre: true,
            apellido: true,
            email: true,
            localidad: true,
            telefono: true
          }
        },
        rubro: true 
      }
    });
    if (!artesano) {
      return next(crearError("El artesano no existe.", 404));
}
  
    return res.json(artesano);
  }catch (error) {
    return next(error);}
};


export const crearArtesano = async (req, res, next) => {
  try{
    const { descripcion, usuarioId, rubroId } = req.body;

    if (!descripcion || !usuarioId || !rubroId) {
      return next(crearError("Faltan datos obligatorios.", 400));
    }
    const nuevoArtesano = await prisma.artesano.create({
      data: {
        descripcion: descripcion.trim(),
        usuarioId: usuarioId,
        rubroId: rubroId
    },
    include: {
      usuario: { 
        select: { 
          nombre: true,
            apellido: true,
            email: true,
            localidad: true,
            telefono: true
          }
        },
        rubro: true 
      }
  })
  return res.status(201).json(nuevoArtesano);
  }catch (error) {
    return next(error);}
};
  
  

export const actualizarArtesano = async (req, res, next) => {
  try {
    const idArtesano = Number(req.params.id);
    if (!Number.isInteger(idArtesano) || idArtesano <= 0) {
      return next(crearError("El identificador del artesano debe ser un entero positivo.", 400));
    }
    const artesano = await prisma.artesano.findUnique({
      where: { id_artesano: idArtesano }
    });
    if (!artesano) {
      return next(crearError("El artesano no existe.", 404));
    }
    
    const { descripcion, rubroId, nombre, apellido, localidadId } = req.body;
    if (!descripcion && !rubroId && !nombre && !apellido && !localidadId) {
      return next(crearError("Debes enviar al menos un campo para actualizar.", 400));
    }
    // Actualiza Artesano y Usuario a la vez
    const artesanoActualizado = await prisma.artesano.update({
      where: { id_artesano: idArtesano },
      data: {
        // datos directos de Artesano
        ...(descripcion && { descripcion: descripcion.trim() }),
        ...(rubroId && { rubroId: rubroId }),
        // datos de usuario
        ...((nombre || apellido || localidadId) && {
          usuario: {
            update: {
              ...(nombre && { nombre: nombre.trim() }),
              ...(apellido && { apellido: apellido.trim() }),
              ...(localidadId && { localidadId: localidadId })
            }
          }
        })
      },
      include: {
        usuario: {
          select: { nombre: true, apellido: true, email: true, localidad: true }
        },
        rubro: true
      }
    });
    res.json(artesanoActualizado);
  } catch (error) {
    return next(error);
  }
};


export const eliminarArtesano = async (req, res, next) => {
  try {
    const idArtesano = Number(req.params.id);
    if (!Number.isInteger(idArtesano) || idArtesano <= 0) {
      return next(crearError("El identificador del artesano debe ser un entero positivo.", 400));
    }
    const artesano = await prisma.artesano.findUnique({
      where: { id_artesano: idArtesano }
    });
    if (!artesano) {
      return next(crearError("El artesano no existe.", 404));
    }
    const artesanoEliminado = await prisma.artesano.delete({
      where: { id_artesano: idArtesano },
    });
    res.json(artesanoEliminado);
  } catch (error) {
    return next(error);
  }
};
