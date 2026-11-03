import { z } from "zod";

export const estadosValidos = [
  "APROBADO",
  "RECHAZADO",
  "PENDIENTE",
  "MODIFICACION_SOLICITADA",
];

// (Postulación del Artesano)
export const crearSolicitudSchema = z.object({
  nombre_emprendimiento: z
    .string("El nombre del emprendimiento es obligatorio")
    .trim()
    .min(3, "El nombre del emprendimiento debe tener mínimo 3 caracteres"),
  descripcion_emprendimiento: z
    .string("La descripción del emprendimiento es obligatoria")
    .trim()
    .min(
      10,
      "La descripción del emprendimiento debe tener al menos 10 caracteres",
    ),
  rubroId: z
    .number("El rubroId es obligatorio")
    .int("El rubroId debe ser un número entero")
    .positive("El rubroId debe ser un entero positivo"),
});

// APROBAR solicitud (Organizador)
export const aprobarSolicitudSchema = z.object({
  observaciones_admin: z
    .string("Las observaciones deben ser texto")
    .trim()
    .min(1, "Las observaciones no pueden estar vacías")
    .optional(),
});

// RECHAZAR solicitud (Organizador)
export const rechazarSolicitudSchema = z.object({
  observaciones_admin: z
    .string("Debes incluir el motivo del rechazo en observaciones_admin")
    .trim()
    .min(5, "El motivo del rechazo debe tener al menos 5 caracteres"),
});

// SOLICITAR MODIFICACIÓN (Organizador)
export const solicitarModificacionSchema = z.object({
  observaciones_admin: z
    .string(
      "Debes detallar las modificaciones solicitadas en observaciones_admin",
    )
    .trim()
    .min(
      5,
      "Debes detallar qué modificaciones requiere la solicitud (mínimo 5 caracteres)",
    ),
});

// ACTUALIZAR solicitud (El artesano corrige y responde a observaciones)
export const actualizarSolicitudSchema = z
  .object({
    nombre_emprendimiento: z
      .string("El nombre del emprendimiento debe ser texto")
      .trim()
      .min(3, "El nombre del emprendimiento debe tener mínimo 3 caracteres")
      .optional(),
    descripcion_emprendimiento: z
      .string("La descripción debe ser texto")
      .trim()
      .min(10, "La descripción debe tener al menos 10 caracteres")
      .optional(),
    rubroId: z
      .number("El rubroId debe ser un número")
      .int("El rubroId debe ser un número entero")
      .positive("El rubroId debe ser un entero positivo")
      .optional(),
  })
  .refine(
    (data) =>
      data.nombre_emprendimiento !== undefined ||
      data.descripcion_emprendimiento !== undefined ||
      data.rubroId !== undefined,
    {
      message:
        "Debes proveer al menos un campo a modificar (nombre_emprendimiento, descripcion_emprendimiento o rubroId)",
    },
  );

export const consultarSolicitudesSchema = z.object({
  estado_solicitud: z.enum(estadosValidos).optional(),
  usuarioId: z
    .uuid("El usuarioId debe ser un UUID válido")
    .optional(),
  rubroId: z.coerce
    .number("El rubroId debe ser un número")
    .int("El rubroId debe ser un número entero")
    .positive("El rubroId debe ser un entero positivo")
    .optional(),
  ordenPor: z
    .enum(["id_solicitud", "estado_solicitud", "createdAt"])
    .default("id_solicitud"),
  direccion: z.enum(["asc", "desc"]).default("desc"),
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
