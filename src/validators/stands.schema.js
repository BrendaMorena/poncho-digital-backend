import { z } from "zod";

const standBaseSchema = z.object({
  numero_stand: z
    .string({ required_error: "El número de stand es obligatorio" })
    .trim()
    .min(1, "El número de Stand no puede estar vacío"),

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

  estado: z.enum(["DISPONIBLE", "OCUPADO", "MANTENIMIENTO"], {
    message: "El estado debe ser DISPONIBLE, OCUPADO o MANTENIMIENTO",
  }).optional(),
});

export const standSchema = standBaseSchema.omit({ estado: true });

// Esquema para ACTUALIZAR (PATCH)
export const actualizarStandSchema = standBaseSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "Debe enviar al menos un campo para actualizar",
    }
  );

// Esquema para FILTRAR STANDS (GET /stands)
export const consultarStandsSchema = z.object({
  termino_busqueda: z
    .string()
    .trim()
    .min(1, "El término de búsqueda no puede estar vacío")
    .optional(),

  numero_stand: z
    .string()
    .trim()
    .min(1, "El número de stand no puede estar vacío")
    .optional(),

  estado: z
    .enum(["DISPONIBLE", "OCUPADO", "MANTENIMIENTO"], {
      message: "El estado debe ser DISPONIBLE, OCUPADO o MANTENIMIENTO",
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
    .coerce.number({ message: "La página debe ser un número" })
    .int("La página debe ser un número entero")
    .positive("La página debe ser mayor a 0")
    .optional(),

  limite: z
    .coerce.number({ message: "El límite debe ser un número" })
    .int("El límite debe ser un número entero")
    .min(1, "El límite mínimo es 1")
    .max(50, "El límite máximo es 50")
    .optional(),
});

// Esquema para ASIGNAR STAND (POST /stands/asignar)
export const asignarStandSchema = z.object({
  artesanoId: z.coerce
    .number({
      required_error: "El artesanoId es obligatorio",
      invalid_type_error: "El artesanoId debe ser un número",
    })
    .int("El artesanoId debe ser un número entero")
    .positive("El artesanoId debe ser un número positivo"),

  standId: z.coerce
    .number({ invalid_type_error: "El standId debe ser un número" })
    .int("El standId debe ser un número entero")
    .positive("El standId debe ser un número positivo")
    .optional(),
});