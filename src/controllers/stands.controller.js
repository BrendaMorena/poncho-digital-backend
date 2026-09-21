import { crearError } from "../utils/errores.js";
import * as standService from "../services/stand.service.js";


export const obtenerStands = async (req, res, next) => {
  try {
    const stands = await standService.obtenerStands();
    return res.status(200).json(stands);
  } catch (error) {
    return next(error);
  }
};

export const obtenerStandsPorId = async (req, res, next) => {
  try {
    const stand = await standService.obtenerStandPorId(req.standId)
    if(!stand){
      return next(crearError(`No existe el Stand con id ${req.params.id}`, 404))
    }
    res.status(200).json(stand)
  } catch (error) {
    next(error)
  }
};

// Segun tengo entendido si devuelve P2002 ya existe en bd
export const crearStand = async (req, res, next) => {
  try {
    const crearStandDTO = req.body
    const nuevoStand = await standService.crearStand(crearStandDTO)

    return res.status(201).json(nuevoStand)
  } catch (error) {
    if(error.code === "P2002"){
      return next(crearError(`El Stand ${req.body.numero_stand} ya existe en el sistema`, 409))
    }
    return next(error)
  }
};

export const actualizarStand = async (req, res, next) => {
  try {
    const idStand = req.standId
    const actualizarStandDTO = req.body
    const standActualizado = await standService.actualizarStand(idStand, actualizarStandDTO)
    
    if(!standActualizado){
      return next(crearError(`No existe un Stand con id ${idStand}`, 404));
    }
    return res.json(standActualizado)
  } catch (error) {
    if (error.code === "P2025") {
      return next(crearError(`No existe un Stand con id ${req.standId}`, 404));
    }
    if (error.code === "P2002") {
      return next(crearError(`El número de stand ya está en uso`, 409));
    }
    return next(error)
  }
};

// export const eliminarAutor = (req, res, next) => {

//     const indice = autores.findIndex(autor => autor.id === req.autorId);

//     if (indice === -1) {
//         return next(crearError(`no existe un autor con id ${req.autorId}`, 404));
//     }

//     autores.splice(indice, 1);
//     res.status(204).send();
// };
