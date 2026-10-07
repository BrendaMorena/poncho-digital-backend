import { z } from "zod";

export const estadosValidos = [
  "APROBADO",
  "RECHAZADO",
  "PENDIENTE",
  "MODIFICACION_SOLICITADA",
];

// (Postulación del Artesano)
export const crearSolicitudSchema = z.object({
  descripcion_emprendimiento: z
    .string({ required_error: "La descripción del emprendimiento es obligatoria" })
    .trim()
    .min(10, "La descripción del emprendimiento debe tener al menos 10 caracteres"),
  usuarioId: z
    .number({ required_error: "El usuarioId es obligatorio" })
    .int()
    .positive("El usuarioId debe ser un entero positivo"),
  rubroId: z
    .number({ required_error: "El rubroId es obligatorio" })
    .int()
    .positive("El rubroId debe ser un entero positivo"),
});

// APROBAR solicitud (Organizador)
// Las observaciones son opcionales y standId es opcional (para asignación manual)
export const aprobarSolicitudSchema = z.object({
  observaciones_admin: z
    .string()
    .trim()
    .min(1, "Las observaciones no pueden estar vacías")
    .optional(),
  standId: z
    .number()
    .int()
    .positive("El standId debe ser un entero positivo")
    .optional(),
});

// RECHAZAR solicitud (Organizador)
// Las observaciones son obligatorias para fundamentar el rechazo
export const rechazarSolicitudSchema = z.object({
  observaciones_admin: z
    .string({ required_error: "Debes incluir el motivo del rechazo en observaciones_admin" })
    .trim()
    .min(5, "El motivo del rechazo debe tener al menos 5 caracteres"),
});

// SOLICITAR MODIFICACIÓN (Organizador)
export const solicitarModificacionSchema = z.object({
  observaciones_admin: z
    .string({ required_error: "Debes detallar las modificaciones solicitadas en observaciones_admin" })
    .trim()
    .min(5, "Debes detallar qué modificaciones requiere la solicitud (mínimo 5 caracteres)"),
});

// ACTUALIZAR solicitud (El artesano corrige y responde a observaciones)
export const actualizarSolicitudSchema = z
  .object({
    descripcion_emprendimiento: z
      .string()
      .trim()
      .min(10, "La descripción debe tener al menos 10 caracteres")
      .optional(),
    rubroId: z
      .number()
      .int()
      .positive("El rubroId debe ser un entero positivo")
      .optional(),
  })
  .refine(
    (data) => data.descripcion_emprendimiento !== undefined || data.rubroId !== undefined,
    {
      message: "Debes proveer al menos un campo a modificar (descripcion_emprendimiento o rubroId)",
    }
  );


export const consultarSolicitudesSchema = z.object({
  estado_solicitud: z.enum(estadosValidos).optional(),
  usuarioId: z.coerce.number().int().positive("El usuarioId debe ser un entero positivo").optional(),
  rubroId: z.coerce.number().int().positive("El rubroId debe ser un entero positivo").optional(),
  ordenPor: z.enum(["id_solicitud", "estado_solicitud", "createdAt"]).default("id_solicitud"),
  direccion: z.enum(["asc", "desc"]).default("desc"),
  pagina: z.coerce.number().int().positive("La página debe ser un número positivo").default(1),
  limite: z.coerce.number().int().min(1).max(50, "El límite máximo es 50").default(10),
});