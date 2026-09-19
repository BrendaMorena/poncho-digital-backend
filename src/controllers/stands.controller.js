import { stands } from "../data/stands.js";
import { crearError } from "../utils/errores.js";
import { siguienteId } from "../utils/siguienteId.js";


export const obtenerStands = (req, res) => {
  res.json(stands)
};

export const obtenerStandsPorId = (req, res, next) => {
  const stand = stands.find((stand) => stand.id === req.standId);

  if (!stand) {
    return next(crearError(`Stand no encontrado ${req.standId}`, 404));
  }

  res.json(stand);
};

export const crearStand = (req, res, next) => {
    const { sector, numeroStand } = req.body;

    if (!sector || !numeroStand ) {
        return next(crearError('Faltan datos obligatorios: sector y numero del Stand son requeridos', 400));
    }

    const standOcupado = stands.some(stand => stand.numeroStand === numeroStand)

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
