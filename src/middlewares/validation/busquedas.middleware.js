import * as busquedaService from "../../services/busqueda.service.js";
import { busquedaSchema, consultaBusquedaSchema } from "../../validators/busqueda.schema.js";
import { validarSchemaBody, validarSchemaQuery } from "../base/validarSchema.js";

export const mensajeError = "Los datos enviados para la busqueda son inválidos";

export const validarBusqueda = validarSchemaBody(busquedaSchema, "crearBusquedaDTO", mensajeError);
export const validarConsultaBusqueda = validarSchemaQuery(consultaBusquedaSchema, "consultaBusquedaDTO", mensajeError);


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
