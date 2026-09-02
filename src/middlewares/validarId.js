import {crearError} from '../utils/errores.js';

// export const validarId = (req, res, next) => {
//     const id = Number(req.params.id);
//     console.log(id, typeof id, "log id");
    
//     if (!Number.isInteger(id) || id <= 0) {
//         return next(crearError('El ID del libro debe ser un número entero positivo', 400));
//     }
  
//     req.libroId = id;
//     next();
// };




const validarId = elementoId => (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return next(crearError('El ID del libro debe ser un número entero positivo', 400));
    }
    req[elementoId] = id;

    next();
};

export const validarAutoresId = validarId("autorId")
export const validarLibrosId = validarId("libroId")