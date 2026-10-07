import { z } from "zod";



export const actualizarArtesanoSchema = z.object({
  nombre_emprendimiento: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres").optional(),
  descripcion: z.string().trim().min(10, "La descripción debe tener al menos 10 caracteres").optional(),
  rubroId: z.number().int().positive("El ID de rubro debe ser positivo").optional()
}).refine((datos) => Object.keys(datos).length > 0, {
  // Este mensaje saldrá si envían un JSON vacío {}
  message: "Debe enviar por lo menos un dato válido para actualizar." 
});


export const consultarArtesanosSchema = z.object({
  pagina: z.coerce.number().int().positive().optional().default(1),
  limite: z.coerce.number().int().positive().max(100).optional().default(10),
  ordenarPor: z.enum(['createdAt', 'id_artesano', 'nombre', 'apellido']).optional().default('createdAt'),
  direccion: z.enum(['asc', 'desc']).optional().default('desc')
});
