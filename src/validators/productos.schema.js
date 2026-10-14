import { z } from "zod";

const productoBaseSchema = z.object({
  nombre_producto: z
    .string("El nombre del producto es obligatorio")
    .trim()
    .min(1, "El nombre del producto no puede estar vacío"),

  precio: z
    .number( "El precio es obligatorio")
    .positive("El precio debe ser mayor a 0"),

  artesanoId: z
    .number("El artesanoId es obligatorio")
    .int("El artesanoId debe ser un número entero")
    .positive("El artesanoId debe ser un número positivo")
})

// Esquema para CREAR (POST)
export const crearProductoSchema = productoBaseSchema

// Esquema para ACTUALIZAR (PATCH)
export const actualizarProductoSchema = productoBaseSchema.partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe enviar al menos un campo para actualizar.",
  })

export const consultarProductoSchema = z
  .object({
    nombre_producto: z
      .string()
      .trim()
      .min(1, "El nombre del producto no puede estar vacío" )
      .optional(),

    artesanoId: z.coerce
      .number("El artesanoId debe ser un número" )
      .int("El artesanoId debe ser un número entero")
      .positive("El artesanoId debe ser un número positivo" )
      .optional(),

    rubroId: z.coerce
      .number("El rubroId debe ser un número")
      .int("El rubroId debe ser un número entero")
      .positive("El rubroId debe ser un número positivo")
      .optional(),

    precioDesde: z.coerce
      .number("El precioDesde debe ser un número")
      .min(0, "El precioDesde no puede ser negativo")
      .optional(),

    precioHasta: z.coerce
      .number("El precioHasta debe ser un número")
      .min(0, "El precioHasta no puede ser negativo")
      .optional(),

    ordenPor: z
      .enum(["nombre_producto", "precio", "createdAt"], {
        errorMap: () => ("El orden debe ser 'nombre_producto' o 'precio'" ),
      })
      .default("nombre_producto"),

    direccion: z
      .enum(["asc", "desc"], {
        errorMap: () => ("La dirección debe ser 'asc' o 'desc'"),
      })
      .default("asc"),

    pagina: z.coerce
      .number("La página debe ser un número" )
      .int("La página debe ser un número entero" )
      .positive("La página debe ser mayor a 0")
      .default(1),

    limite: z.coerce
      .number("El límite debe ser un número" )
      .int("El límite debe ser un número entero")
      .min(1, "El límite mínimo es 1")
      .max(50, "El límite máximo permitido es 50" )
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