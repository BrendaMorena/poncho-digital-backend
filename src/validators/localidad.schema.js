import { z } from "zod";

const localidadBaseSchema = z.object({
  nombre_locacion: z
    .string("El nombre de la localidad es obligatorio")
    .trim()
    .min(3, "El nombre de la localidad debe tener al menos 3 caracteres"),
});

// Esquema para CREAR (POST)
export const crearLocalidadSchema = localidadBaseSchema;

// Esquema para ACTUALIZAR (PATCH / PUT)
export const actualizarLocalidadSchema = localidadBaseSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe enviar al menos un campo para actualizar.",
  });

export const consultarLocalidadesSchema = z.object({
  buscar: z.string().trim().optional(),
  ordenPor: z
    .enum(["id_localidad", "nombre_locacion", "createdAt"])
    .default("id_localidad"),
  direccion: z.enum(["asc", "desc"]).default("asc"),
  pagina: z.coerce
    .number("La página debe ser un número")
    .int("La página debe ser un número entero")
    .positive("La página debe ser un número positivo")
    .default(1),
  limite: z.coerce
    .number("El límite debe ser un número")
    .int("El límite debe ser un número entero")
    .min(1, "El límite mínimo es 1")
    .max(50, "El límite máximo es 50")
    .default(10),
});
