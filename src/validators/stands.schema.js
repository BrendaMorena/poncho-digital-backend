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

  pabellonId: z
    .number({ invalid_type_error: "El pabellonId debe ser un número" })
    .int("El pabellonId debe ser un número entero")
    .positive("El pabellonId debe ser un número positivo")
    .nullable()
    .optional(),

  sectorId: z
    .number({ invalid_type_error: "El sectorId debe ser un número" })
    .int("El sectorId debe ser un número entero")
    .positive("El sectorId debe ser un número positivo")
    .nullable()
    .optional(),

  estado: z.enum(["DISPONIBLE", "OCUPADO", "MANTENIMIENTO"], {
    errorMap: () => ({ message: "El estado debe ser DISPONIBLE, OCUPADO o MANTENIMIENTO" })
  }).optional(),
});

export const standSchema = standBaseSchema.refine(
  (data) => Boolean(data.pabellonId) !== Boolean(data.sectorId),
  {
    message: "El stand debe pertenecer a un Pabellón O a un Sector, pero no a ambos ni a ninguno",
    path: ["pabellonId"]
  }  
);

// Esquema para ACTUALIZAR (PATCH)
export const actualizarStandSchema = standBaseSchema.partial();