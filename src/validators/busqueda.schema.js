import { z } from "zod";

const busquedaBaseSchema = z.object({
  termino_busqueda: z
  .string()
  .trim()
  .min(1)
  .transform((val) => val.toLowerCase())
  .optional()
  .nullable(),

  rubroId: z
  .coerce.number()
  .int()
  .positive()
  .optional(),

  pabellonId: z
  .coerce.number()
  .int()
  .positive()
  .optional(),

  localidadId: z
  .coerce.number()
  .int()
  .positive()
  .optional(),

})

export const busquedaSchema = busquedaBaseSchema.refine(
  (data) => Boolean(data.termino_busqueda || data.rubroId || data.pabellonId || data.localidadId),
  { message: "La búsqueda debe contener al menos un criterio para ser registrada" }
);

export const consultaBusquedaSchema = busquedaBaseSchema.extend({  
  fechaDesde: z
    .coerce.date()
    .optional(),

  fechaHasta: z
    .coerce.date()
    .optional(),

  ordenarPor: z
    .enum(["createdAt", "termino_busqueda"])
    .default("createdAt"),

  direccion: z
    .enum(["asc", "desc"])
    .default("desc"),

  pagina: z
    .coerce.number({ message: "La página debe ser un número" })
    .int("La página debe ser un número entero")
    .positive("La página debe ser mayor a 0")
    .default(1),

  limite: z
    .coerce.number({ message: "El límite debe ser un número" })
    .int("El límite debe ser un número entero")
    .min(1, "El límite mínimo es 1")
    .max(50, "El límite máximo es 50")
    .default(10),
})