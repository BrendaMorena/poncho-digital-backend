import { crearError, detallarErroresZod } from "../utils/errores.js";
import { consultarArtesanosSchema } from "../validators/artesanos.schemas.js";

export const validarArtesanos = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body); 
    next();
  } catch (error) {
      return res.status(400).json({
      mensaje: "Errores de validación",
      errores: error.errors.map(err => err.message)
    });
  }
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