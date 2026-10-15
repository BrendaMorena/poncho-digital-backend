import { z } from "zod";

export const crearArtesanoSchema = z.object({
  nombre_emprendimiento: z
    .string({ error: "El nombre es obligatorio y tiene que ser texto" })
    .min(3, "El nombre del emprendimiento debe tener al menos 3 caracteres"),
  
  descripcion_emprendimiento: z
    .string({ error: "La descripción del emprendimiento es obligatoria" })
    .min(10, "La descripción debe tener al menos 10 caracteres"),

  usuarioId: z
    .string({ error: "El usuarioId es obligatorio" })
    .uuid("El usuarioId debe ser un UUID válido"),

  rubroId: z
    .number({ error: "El rubroId es obligatorio" })
    .int("El rubroId debe ser un número entero")
    .positive("El rubro tiene que ser un numero entero positivo."),
});



export const actualizarArtesanoSchema = z.object({
  nombre_emprendimiento: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres").optional(),
  descripcion_emprendimiento: z.string().trim().min(10, "La descripción debe tener al menos 10 caracteres").optional(),
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


