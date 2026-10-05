import { crearError, detallarErroresZod } from "../utils/errores.js";


export const validarRubro = (schema) => (req, res, next) => {
  const resultado = schema.safeParse(req.body);
  
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError(
        "Los datos enviados para el rubro son inválidos",
        400,
        detalles
      )
    );
  }
  
  req.body = resultado.data;
  return next();
};