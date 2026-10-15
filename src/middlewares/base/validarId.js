import { crearError } from '../../utils/errores.js';
import { z } from "zod";

const validarId = elementoId => (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return next(crearError('El ID debe ser un número entero positivo', 400));
    }
    req[elementoId] = id;

    next();
};
export const validarArtesanoId = validarId("artesanoId");
//export const validarStandId = validarId("standId")
export const validarRubroId = validarId("rubroId");
export const validarStandId = validarId("standId");
export const validarPabellonId = validarId("pabellonId");
export const validarSectorId = validarId("sectorId");
export const validarRolId = validarId("rolId");
export const validarSolicitudId = validarId("solicitudId");
export const validarLocalidadId = validarId("localidadId");
export const validarUsuarioId = (req, res, next) => {
    const { id } = req.params;

    if (!z.string().uuid().safeParse(id).success) {
        return next(crearError('El ID del usuario debe ser un UUID válido', 400));
    }
    req.usuarioId = id;
    next();
};
export const validarBusquedaId = validarId("busquedaId");
export const validarProductoId = validarId("productoId");
