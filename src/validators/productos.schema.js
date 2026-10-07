import { z } from "zod";

const productoBaseSchema = z.object({
  nombre_producto: z
    .string({ required_error: "El nombre del producto es obligatorio" })
    .trim()
    .min(1, "El nombre del producto no puede estar vacío"),

  precio: z
    .number({
      required_error: "El precio es obligatorio"
    })
    .positive("El precio debe ser mayor a 0"),

  artesanoId: z
    .number({
      required_error: "El artesanoId es obligatorio"
    })
    .int("El artesanoId debe ser un número entero")
    .positive("El artesanoId debe ser un número positivo")
})

// Esquema para CREAR (POST)
export const crearProductoSchema = productoBaseSchema

// Esquema para ACTUALIZAR (PATCH): campos opcionales, pero exige al menos uno
export const actualizarProductoSchema = productoBaseSchema.partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe enviar al menos un campo para actualizar.",
  })

export const consultarProductoSchema = z
  .object({
    nombre_producto: z
      .string()
      .trim()
      .min(1, { message: "El nombre del producto no puede estar vacío" })
      .optional(),

    artesanoId: z.coerce
      .number({ invalid_type_error: "El artesanoId debe ser un número" })
      .int({ message: "El artesanoId debe ser un número entero" })
      .positive({ message: "El artesanoId debe ser un número positivo" })
      .optional(),

    rubroId: z.coerce
      .number({ invalid_type_error: "El rubroId debe ser un número" })
      .int({ message: "El rubroId debe ser un número entero" })
      .positive({ message: "El rubroId debe ser un número positivo" })
      .optional(),

    precioDesde: z.coerce
      .number({ invalid_type_error: "El precioDesde debe ser un número" })
      .min(0, { message: "El precioDesde no puede ser negativo" })
      .optional(),

    precioHasta: z.coerce
      .number({ invalid_type_error: "El precioHasta debe ser un número" })
      .min(0, { message: "El precioHasta no puede ser negativo" })
      .optional(),

    ordenPor: z
      .enum(["nombre_producto", "precio", "createdAt"], {
        errorMap: () => ({ message: "El orden debe ser 'nombre_producto' o 'precio'" }),
      })
      .default("nombre_producto"),

    direccion: z
      .enum(["asc", "desc"], {
        errorMap: () => ({ message: "La dirección debe ser 'asc' o 'desc'" }),
      })
      .default("asc"),

    pagina: z.coerce
      .number({ invalid_type_error: "La página debe ser un número" })
      .int({ message: "La página debe ser un número entero" })
      .positive({ message: "La página debe ser mayor a 0" })
      .default(1),

    limite: z.coerce
      .number({ invalid_type_error: "El límite debe ser un número" })
      .int({ message: "El límite debe ser un número entero" })
      .min(1, { message: "El límite mínimo es 1" })
      .max(50, { message: "El límite máximo permitido es 50" })
      .default(10),
  })
  .refine(
    ({ precioDesde, precioHasta }) =>
      precioDesde === undefined || precioHasta === undefined || precioDesde <= precioHasta,
    {
      message: "El precioDesde no puede ser mayor que el precioHasta",
      path: ["precioDesde", "precioHasta"],
    }
  )