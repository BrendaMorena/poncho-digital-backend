import {
  standSchema,
  actualizarStandSchema,
  consultarStandsSchema,
  asignarStandSchema,
} from "../validators/stands.schema.js";
import { crearError, detallarErroresZod } from "../utils/errores.js";


export const validarStand = (req, res, next) => {
  const resultado = standSchema.safeParse(req.body);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError(
        "Los datos enviados para el stand son inválidos",
        400,
        detalles,
      ),
    );
  }
  req.body = resultado.data;
  return next();
};

export const validarActualizarStand = (req, res, next) => {
  const resultado = actualizarStandSchema.safeParse(req.body);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError(
        "Los datos enviados para actualizar el stand son inválidos",
        400,
        detalles,
      ),
    );
  }
  req.body = resultado.data;
  return next();
};

export const validarConsultaStands = (req, res, next) => {
  const resultado = consultarStandsSchema.safeParse(req.query);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError(
        "Los datos enviados para consultar el stand son inválidos",
        400,
        detalles,
      ),
    );
  }
  req.consultaStands = resultado.data;
  return next();
};

export const validarAsignarStand = (req, res, next) => {
  const resultado = asignarStandSchema.safeParse(req.body);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError(
        "Los datos enviados para la asignación del stand son inválidos",
        400,
        detalles,
      ),
    );
  }
  req.body = resultado.data;
  return next();
};

