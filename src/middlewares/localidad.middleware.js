import {
  crearLocalidadSchema,
  actualizarLocalidadSchema,
  consultarLocalidadesSchema,
} from "../validators/localidad.schema.js";
import { crearError, detallarErroresZod } from "../utils/errores.js";

export const validarCreacionLocalidad = (req, res, next) => {
  const resultado = crearLocalidadSchema.safeParse(req.body);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError("Los datos enviados para crear la localidad son inválidos", 400, detalles)
    );
  }
  req.body = resultado.data;
  return next();
};

export const validarActualizacionLocalidad = (req, res, next) => {
  const resultado = actualizarLocalidadSchema.safeParse(req.body);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError("Los datos enviados para actualizar la localidad son inválidos", 400, detalles)
    );
  }
  req.body = resultado.data;
  return next();
};

export const validarConsultaLocalidades = (req, res, next) => {
  const resultado = consultarLocalidadesSchema.safeParse(req.query);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError("Los parámetros de consulta de localidades son inválidos", 400, detalles)
    );
  }
  req.consultaLocalidades = resultado.data;
  return next();
};
