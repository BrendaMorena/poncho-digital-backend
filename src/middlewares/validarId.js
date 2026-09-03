import {crearError} from '../utils/errores.js';


const validarId = elementoId => (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return next(crearError('El ID del artesano debe ser un número entero positivo', 400));
    }
    req[elementoId] = id;

    next();
};

export const validarArtesanosId = validarId("artesanoId")
//export const validarLibrosId = validarId("libroId")