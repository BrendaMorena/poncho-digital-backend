import {artesanos} from '../data/artesanos.js';
import { crearError } from '../utils/errores.js';
import { siguienteId } from '../utils/siguienteId.js';



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




export const obtenerArtesanoPorId = (req, res, next) => {

    const artesano = artesanos.find(artesano => artesano.id === req.artesanoId);

    if (!artesano) {
        return next(crearError(`no existe un artesano con id ${req.artesanoId}`, 404));
    }

    res.json(artesano);
};


export const crearArtesano = (req, res, next) => {
    const { nombre, rubro, localidad } = req.body;

    if (!nombre || !rubro || !localidad) {
        return next(crearError('Faltan datos obligatorios: nombre, rubro y localidad son requeridos', 400));
    }

    const nuevoArtesano = { id: siguienteId(artesanos), nombre, rubro, localidad };

    artesanos.push(nuevoArtesano);
    res.status(201).json(nuevoArtesano);
};

export const actualizarArtesano = (req, res, next) => {
  const index = artesanos.findIndex((artesano) => artesano.id === req.artesanoId);

  if (index === -1) {
    return next(crearError(`no existe un artesano con id ${req.artesanoId}`, 404));
  }

  const { nombre, rubro, localidad } = req.body;

  if (!nombre && !rubro && !localidad) {
    return next(
      crearError(
        'Tiene que haber al menos un campo para actualizar: nombre, rubro o localidad',
        400,
      ),
    );
  }

  const cambios = {};
  if (nombre) cambios.nombre = nombre;
  if (rubro) cambios.rubro = rubro;
  if (localidad) cambios.localidad = localidad;

  artesanos[index] = { ...artesanos[index], ...cambios };

  res.json(artesanos[index]);
};

export const eliminarArtesano = (req, res, next) => {

    const indice = artesanos.findIndex(artesano => artesano.id === req.artesanoId);

    if (indice === -1) {
        return next(crearError(`no existe un artesano con id ${req.artesanoId}`, 404));
    }

    artesanos.splice(indice, 1);
    res.status(204).send();
};