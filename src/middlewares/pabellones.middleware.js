import {
  pabellonSchema,
  actualizarPabellonSchema,
  consultarPabellonesSchema,
} from "../validators/pabellones.schema.js";
import { crearError, detallarErroresZod } from "../utils/errores.js";

export const validarPabellon = (req, res, next) => {
  const resultado = pabellonSchema.safeParse(req.body);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError(
        "Los datos enviados para el pabellón son inválidos",
        400,
        detalles
      )
    );
  }
  req.body = resultado.data;
  return next();
};

export const validarActualizarPabellon = (req, res, next) => {
  const resultado = actualizarPabellonSchema.safeParse(req.body);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError(
        "Los datos enviados para actualizar el pabellón son inválidos",
        400,
        detalles
      )
    );
  }
  req.body = resultado.data;
  return next();
};

export const validarConsultaPabellones = (req, res, next) => {
  const resultado = consultarPabellonesSchema.safeParse(req.query);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError(
        "Los datos enviados para consultar los pabellones son inválidos",
        400,
        detalles
      )
    );
  }
  req.consultaPabellones = resultado.data;
  return next();
};
