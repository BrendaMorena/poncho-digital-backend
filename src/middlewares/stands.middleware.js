import { crearStandSchema } from "../validators/stands.schema.js";
import { crearError, detallarErroresZod } from "../utils/errores.js";

export const validarCreacionSchema = (req, res, next) => {
  const resultado = crearStandSchema.safeParse(
    req.body
  )
  if(!resultado.success){
    const detalles = detallarErroresZod(resultado.error);
    return next(crearError('Los datos enviados para el stand son inválidos', 400, detalles));
  }
  req.body = resultado.data
  return next()
};
