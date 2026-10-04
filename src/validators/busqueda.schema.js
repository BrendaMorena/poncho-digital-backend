import { z } from zod;

export const busquedaSchema = z.object({
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
  .optional()
  .nullable(),

  pabellonId: z
  .coerce.number()
  .int()
  .positive()
  .optional()
  .nullable(),

  localidadId: z
  .coerce.number()
  .int()
  .positive()
  .optional()
  .nullable()
  
}).refine(
  (data) => Boolean(data.termino_busqueda || data.rubroId || data.pabellonId || data.localidadId),
  { message: "La búsqueda debe contener al menos un criterio para ser registrada" }
);