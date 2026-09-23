import { crearError, detallarErroresZod } from "../utils/errores.js";
import { consultarArtesanosSchema } from "../validators/artesanos.schemas.js";

export const validarArtesanos = (schema) => (req, res, next) => {
  const resultado = schema.safeParse(req.body);
  
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError(
        "Los datos enviados para el artesano son inválidos",
        400,
        detalles
      )
    );
  }
  
  req.body = resultado.data;
  return next();
};

export const validarConsultaArtesanos = (req, res, next) => {
  const resultado = consultarArtesanosSchema.safeParse(req.query);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError(
        "Los datos enviados para consultar el artesano son inválidos",
        400,
        detalles,
      ),
    );
  }
  req.consultaArtesanos = resultado.data;
  return next();
};