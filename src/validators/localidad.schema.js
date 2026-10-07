import { z } from "zod";

export const crearLocalidadSchema = z.object({
  nombre_locacion: z
    .string({ required_error: "El nombre de la localidad es obligatorio" })
    .trim()
    .min(3, "El nombre de la localidad debe tener al menos 3 caracteres"),
});

export const actualizarLocalidadSchema = z.object({
  nombre_locacion: z
    .string({ required_error: "El nombre de la localidad es obligatorio" })
    .trim()
    .min(3, "El nombre de la localidad debe tener al menos 3 caracteres"),
});

export const consultarLocalidadesSchema = z.object({
  buscar: z.string().trim().optional(),
  ordenPor: z
    .enum(["id_localidad", "nombre_locacion", "createdAt"])
    .default("id_localidad"),
  direccion: z.enum(["asc", "desc"]).default("asc"),
  pagina: z.coerce
    .number()
    .int()
    .positive("La página debe ser un número positivo")
    .default(1),
  limite: z.coerce
    .number()
    .int()
    .min(1)
    .max(50, "El límite máximo es 50")
    .default(10),
});
