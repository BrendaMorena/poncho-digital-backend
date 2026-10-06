import { crearError, detallarErroresZod } from "../utils/errores.js";
import * as busquedaService from "../services/busqueda.service.js";
import { busquedaSchema, consultaBusquedaSchema } from "../validators/busqueda.schema.js";

export const validarBusqueda = (req, res, next) => {
  const resultado = busquedaSchema.safeParse(req.body)
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError(
        "Los datos enviados para la busqueda son inválidos",
        400,
        detalles
      )
    );
  }
  req.body = resultado.data
  return next()
};

export const validarConsultaBusqueda = (req, res, next) => {
  const resultado = consultaBusquedaSchema.safeParse(req.query)
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError(
        "Los datos enviados para la busqueda son inválidos",
        400,
        detalles
      )
    );
  }
  req.valoresBusqueda = resultado.data
  return next()
};


export const capturarBusqueda = (req, res, next) => {
  if(req.method !== "GET") return next()
  res.on('finish', async ()=>{
    try {
      if (res.statusCode < 200 || res.statusCode >= 300) return;

      const resultado = busquedaSchema.safeParse(req.query);
      if (!resultado.success) return

      await busquedaService.crearBusqueda(resultado.data)
    } catch (error) {
      console.error("Error al registrar la busqueda", error.message)
    }
  })
  return next();
};
