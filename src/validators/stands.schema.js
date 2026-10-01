import { z } from "zod";

const standBaseSchema = z.object({
  numero_stand: z
    .string({ required_error: "El número de stand es obligatorio" })
    .trim()
    .min(1, "El número de Stand no puede estar vacío"),

  estado: z.enum(["DISPONIBLE", "OCUPADO", "MANTENIMIENTO"], {
    errorMap: () => ({ message: "El estado debe ser DISPONIBLE, OCUPADO o MANTENIMIENTO" })
  }).optional(),

  coordenada: z.object(
    {
      lat: z
        .number({ 
          required_error: "La latitud es obligatoria",
          invalid_type_error: "La latitud debe ser un número" 
        })
        .min(-90, "La latitud mínima permitida es -90")
        .max(90, "La latitud máxima permitida es 90"),

      lng: z
        .number({ 
          required_error: "La longitud es obligatoria",
          invalid_type_error: "La longitud debe ser un número" 
        })
        .min(-180, "La longitud mínima permitida es -180")
        .max(180, "La longitud máxima permitida es 180"),
    },
    { required_error: "El objeto coordenada es obligatorio" }
  ),

  sectorId: z
    .number({ invalid_type_error: "El sectorId debe ser un número" })
    .int("El sectorId debe ser un número entero")
    .positive("El sectorId debe ser un número positivo"),
})

export const standSchema = standBaseSchema
.omit({ estado: true })

// Esquema para ACTUALIZAR (PATCH)
export const actualizarStandSchema = standBaseSchema
.partial()
.refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "Debe enviar al menos un campo para actualizar",
    }
  )

// Esquema para FILTRAR STANDS (GET /stands)
export const consultarStandsSchema = z.object({
  estado: z
    .enum(["DISPONIBLE", "OCUPADO", "MANTENIMIENTO"], {
      message: "El estado debe ser DISPONIBLE, OCUPADO o MANTENIMIENTO"
    })
    .optional(),

  sectorId: z.coerce
    .number({ message: "El sectorId debe ser un número" })
    .int("El sectorId debe ser un número entero")
    .positive("El sectorId debe ser positivo")
    .optional(),

  rubroId: z.coerce
    .number({ message: "El rubroId debe ser un número" })
    .int("El rubroId debe ser un número entero")
    .positive("El rubroId debe ser positivo")
    .optional(),

  ordenarPor: z
    .enum(["numero_stand", "rubro"])
    .default("numero_stand"),

  direccion: z
    .enum(["asc", "desc"])
    .default("asc"),

  pagina: z
    .coerce.number()
    .int()
    .positive()
    .optional(),

  limite: z
    .coerce.number()
    .int()
    .min(1)
    .max(50)
    .optional(),
});