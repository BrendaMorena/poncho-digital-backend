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
export const actualizarStandSchema = standBaseSchema.partial()
.refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "Debe enviar al menos un campo para actualizar",
    }
  )
.refine(
  (data) => {
    // Solo validamos la regla si el cliente envió AMBOS campos en la petición
    if (data.pabellonId !== undefined && data.sectorId !== undefined) {
      const tienePabellon = data.pabellonId !== null;
      const tieneSector = data.sectorId !== null;
      // No puede tener ambos asignados, ni tampoco quedar ambos en null
      return Boolean(tienePabellon) !== Boolean(tieneSector);
    }
    return true; // Si mandó solo uno o ninguno, pasa la validación del schema
  },
  {
    message: "El stand no puede pertenecer a un Pabellón y a un Sector al mismo tiempo, ni quedar sin ninguno",
    path: ["pabellonId"],
  }
);

// Esquema para FILTRAR STANDS (GET /stands)
export const consultarStandsSchema = z.object({
  estado: z
    .enum(["DISPONIBLE", "OCUPADO", "MANTENIMIENTO"], {
      errorMap: () => ({ message: "El estado debe ser DISPONIBLE, OCUPADO o MANTENIMIENTO" }),
    })
    .optional(),

  pabellonId: z.coerce
    .number({ invalid_type_error: "El pabellonId debe ser un número" })
    .int("El pabellonId debe ser un número entero")
    .positive("El pabellonId debe ser positivo")
    .optional(),

  sectorId: z.coerce
    .number({ invalid_type_error: "El sectorId debe ser un número" })
    .int("El sectorId debe ser un número entero")
    .positive("El sectorId debe ser positivo")
    .optional(),

  rubroId: z.coerce
    .number({ invalid_type_error: "El rubroId debe ser un número" })
    .int("El rubroId debe ser un número entero")
    .positive("El rubroId debe ser positivo")
    .optional(),

  ordenarPor: z
    .enum(["numero_stand", "createdAt", "rubro"])
    .default("numero_stand"),

  direccion: z
    .enum(["asc", "desc"])
    .default("asc"),
});