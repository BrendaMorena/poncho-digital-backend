import {
  crearProductoSchema,
  actualizarProductoSchema,
  consultarProductoSchema,
} from "../validators/productos.schema.js";
import { crearError, detallarErroresZod } from "../utils/errores.js";

export const validarCreacionProducto = (req, res, next) => {
  const resultado = crearProductoSchema.safeParse(req.body)

  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error)
    return next(crearError("Los datos enviados para el producto son inválidos.",400,detalles))
  }

  req.body = resultado.data
  return next()
}

export const validarActualizarProducto = (req, res, next) => {
  const resultado = actualizarProductoSchema.safeParse(req.body)

  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error)
    return next(crearError("Los datos enviados para actualizar el producto son inválidos.",400,detalles))
  }

  req.body = resultado.data
  return next()
}

export const validarConsultaProducto = (req, res, next) => {
   const resultado = consultarProductoSchema.safeParse(req.body)

  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error)
    return next(crearError("Los datos enviados para consultar el producto son inválidos.",400,detalles))
  }

  req.consultaProducto = resultado.data
  return next()
}