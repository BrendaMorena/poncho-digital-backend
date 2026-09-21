import { stands } from "../data/stands.js";
import { crearError } from "../utils/errores.js";
import { siguienteId } from "../utils/siguienteId.js";
import prisma from "../config/prisma.js";


export const obtenerStands = async (req, res, next) => {
  try {
    const stands = await prisma.stand.findMany()
    return res.json(stands)
  } catch (error) {
    return next(error)
  }
};

export const obtenerStandsPorId = async (req, res, next) => {
  const stand = await prisma.stand.findUnique({
    where:{id_stand: req.standId}
  })

  if (!stand) {
    return next(crearError(`Stand ${req.standId} no encontrado`, 404));
  }

  res.json(stand);
};

export const crearStand = async (req, res, next) => {
    const { sector, numeroStand } = req.body;

    if (!sector || !numeroStand ) {
        return next(crearError('Faltan datos obligatorios: sector y numero del Stand son requeridos', 400));
    }

    const standOcupado = stands.some(stand => stand.numeroStand === numeroStand)

    const standLibre = prisma.stand.create({
      
    })

    if (standOcupado){
      return next(crearError('Stand actualmente ocupado', 409));
    }

    const nuevoId = siguienteId(stands);

    const nuevoStand = { id: nuevoId, nombre: null, sector: sector, numeroStand: numeroStand, artesanoId: null };
    
    stands.push(nuevoStand);
    res.status(201).json(nuevoStand);
};

export const actualizarStand = (req, res, next) => {
  const index = stands.findIndex((a) => a.id === req.standId);

  if (index === -1) {
    return next(crearError(`no existe un Stand con id ${req.standId}`, 404));
  }

  const { nombre, nacionalidad } = req.body;

  if (!nombre && !nacionalidad) {
    return next(
      crearError(
        "Tiene que haber al menos un campo obligatorio: nombre y nacionalidad son requeridos",
        400,
      ),
    );
  }

  const cambios = {};
  if (nombre) cambios.nombre = nombre;
  if (nacionalidad) cambios.nacionalidad = nacionalidad;

  autores[index] = { ...autores[index], ...cambios };

  res.json(autores[index]);
};

// export const eliminarAutor = (req, res, next) => {

//     const indice = autores.findIndex(autor => autor.id === req.autorId);

//     if (indice === -1) {
//         return next(crearError(`no existe un autor con id ${req.autorId}`, 404));
//     }

//     autores.splice(indice, 1);
//     res.status(204).send();
// };
