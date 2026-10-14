import {
  crearProductoSchema,
  actualizarProductoSchema,
  consultarProductoSchema,
} from "../../validators/productos.schema.js";
import { validarSchemaBody, validarSchemaQuery } from "../base/validarSchema.js";

export const validarCreacionProducto = validarSchemaBody(crearProductoSchema, "crearProductoDTO", "Los datos enviados para el producto son inválidos.");
export const validarActualizarProducto = validarSchemaBody(actualizarProductoSchema, "actualizarProductoDTO", "Los datos enviados para actualizar el producto son inválidos.");
export const validarConsultaProducto = validarSchemaQuery(consultarProductoSchema, "consultaProductoDTO", "Los datos enviados para consultar el producto son inválidos.");