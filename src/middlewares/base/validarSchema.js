import { crearError, detallarErroresZod } from "../../utils/errores.js";

const validarSchema = (origen) => (schema, destino, mensaje) => (req, res, next) => {
  const datos = req[origen] ?? {};
  const resultado = schema.safeParse(datos);
  
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError(
        mensaje || `Los datos enviados en ${origen} son inválidos`,
        400,
        detalles
      )
    );
  }
  
  req[destino] = resultado.data;
  return next();
};

export const validarSchemaBody = validarSchema("body")
export const validarSchemaQuery = validarSchema("query")
export const validarSchemaParams = validarSchema("params")