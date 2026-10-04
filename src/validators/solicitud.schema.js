import { z } from "zod";

const estadosValidos = [
  "APROBADO",
  "RECHAZADO",
  "PENDIENTE",
  "MODIFICACION_SOLICITADA",
];

export const crearSolicitudSchema = z.object({
  descripcion_emprendimiento: z
    .string()
    .trim()
    .min(10, "La descripción del emprendimiento es obligatoria y un minimo de 10 caracteres"),
  usuarioId: z.number().int().positive("El usuarioId debe ser un entero positivo"),
  rubroId: z.number().int().positive("El rubroId debe ser un entero positivo"),
})

//Administrar solicitudes para que se contemplen los 3 estados de solicitud

export const aprobarSolicitudSchema = z.object({
  observaciones_admin: z.string().trim().min(1).optional().nullable(),
})
//Contemplar borrar aprobarSolicitud y usar actualizar solosolicitud esquema, si el estadoes aprobado hacer un create y si es rechado devolderun obersevaciones admin ysi el estado es pendienteamodificacion devolver observaciones admin

// Separar actualizarSolicitudSchema, un organizador va a querer buscar cambiar el estado y la observacionAdmi------ o agregar otro schema por si un artenaso quiere actualizar rubro o descripcion.
export const actualizarSolicitudSchema = z.object({
  descripcion_emprendimiento: z.string().trim().min(1).optional(),
  estado_solicitud: z.enum(estadosValidos).optional(),
  observaciones_admin: z.string().trim().min(1).optional().nullable(),
  rubroId: z.number().int().positive().optional(),
})

/* 2. Para el ADMIN/ORGANIZADOR: unifica aprobar, rechazar y pedir modificación (PATCH /solicitudes/:id/estado)
export const evaluarSolicitudSchema = z
  .object({
    estado_solicitud: z.enum(estadosEvaluacion),
    observaciones_admin: z.string().trim().min(1).optional().nullable(),
  })
  .refine(
    (data) => {
      // Si rechaza o pide modificación, obligamos a que mande observaciones_admin
      if (
        (data.estado_solicitud === "RECHAZADO" ||
          data.estado_solicitud === "MODIFICACION_SOLICITADA") &&
        !data.observaciones_admin
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Debes incluir observaciones_admin al rechazar o solicitar modificaciones",
      path: ["observaciones_admin"],
    }
  );

// 3. Para el POSTULANTE: solo puede editar su descripción o rubro (PUT /solicitudes/:id)
export const actualizarSolicitudUsuarioSchema = z.object({
  descripcion_emprendimiento: z.string().trim().min(1).optional(),
  rubroId: z.number().int().positive().optional(),
}); */


export const consultarSolicitudesSchema = z.object({
  estado_solicitud: z.enum(estadosValidos).optional(),
  usuarioId: z.coerce.number().int().positive().optional(),
  rubroId: z.coerce.number().int().positive().optional(),
  ordenPor: z.enum(["id_solicitud", "estado_solicitud"]).default("id_solicitud"),
  direccion: z.enum(["asc", "desc"]).default("desc"),
  pagina: z.coerce.number().int().positive().default(1),
  limite: z.coerce.number().int().min(1).max(50).default(10),
})