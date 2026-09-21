import { stands } from "../data/stands.js";
import { crearError } from "../utils/errores.js";
import { siguienteId } from "../utils/siguienteId.js";
import { crearStand as crearStandService} from "../services/stand.service.js";


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

// Segun tengo entendido si devuelve P2002 ya existe en bd
export const crearStand = async (req, res, next) => {
  try {
    const crearStandDTO = req.body
    const nuevoStand = await crearStandService(crearStandDTO)

    return res.status(201).json(nuevoStand)
  } catch (error) {

    if(error.code === "P2002"){
      return next(crearError(`El Stand ${req.body.numero_stand} ya existe en el sistema`, 409))
    }
    return next(error)
  }
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
