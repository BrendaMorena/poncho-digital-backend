import {z} from "zod";
// CONSIDERAR EMPRENDIMIENTO Y INTERPRETAR QUIEN LO USARIA (SOLICITUD O USUARIO)
// RUBRO?
export const actualizarUsuarioSchema = z.object({
  nombre: z
    .string()
    .min(3)
    .optional(),

  apellido: z
    .string()
    .min(3)
    .optional(), 

  dni: z
    .string()
    .regex(/^[0-9]+$/, "El DNI solo debe contener números")
    .min(7, "El DNI debe tener al menos 7 dígitos")
    .max(8, "El DNI no debe superar los 8 dígitos")
    .optional(),
  
  email: z.email({error: "El email ingresado no es válido."}).optional(),

  telefono: z
    .string()
    .regex(/^[0-9]+$/, "El teléfono solo debe contener números")
    .min(10, "El teléfono debe tener al menos 10 dígitos")
    .optional(),

  localidadId: z
    .number()
    .int()
    .positive()
    .optional()

  }).refine((datos) => Object.keys(datos).length > 0, {
  // Este mensaje saldrá si envían un JSON vacío {}
  message: "Debe enviar por lo menos un dato válido para actualizar."
});

// AGREGAR TERMINO DE BUSQUEDA Y FILTROS
export const consultarUsuarioSchema = z.object({

  pagina: z.coerce.number().int().positive().optional().default(1),

  limite: z.coerce.number().int().positive().max(100).optional().default(10),

  ordenarPor: z.enum(['createdAt', 'id_usuario', 'nombre', 'apellido']).optional().default('createdAt'),

  direccion: z.enum(['asc', 'desc']).optional().default('desc')
});

// 1. SCHEMA BASE: Datos personales que comparten TODOS los usuarios
const usuarioBaseSchema = z.object({
  nombre: z
    .string({ error: "El nombre es obligatorio y debe ser texto" })
    .trim()
    .min(2, "El nombre debe tener por lo menos 2 caracteres."),

  apellido: z
    .string({ error: "El apellido es obligatorio y debe ser texto" })
    .trim()
    .min(2, "El apellido debe tener por lo menos 2 caracteres."),

  dni: z
    .string()
    .regex(/^[0-9]+$/, "El DNI solo debe contener números")
    .min(7, "El DNI debe tener al menos 7 dígitos")
    .max(8, "El DNI no debe superar los 8 dígitos")
    .optional(),

  email: z.email({error: "El email ingresado no es válido."}),

  password: z
    .string({error: "La contraseña es obligatoria y debe ser un texto"})
    .min(8, "La contraseña debe tener mínimo 8 caracteres.")
    .regex(/[a-zA-Z]/, "Debe contener al menos una letra.")
    .regex(/[0-9]/, "Debe contener al menos un número."),

  telefono: z
    .string({ error: "El teléfono es obligatorio y debe ser texto" })
    .trim()
    .min(6, "El teléfono es obligatorio.")
    .regex(/^[0-9]+$/, "El teléfono solo debe contener números")
    .min(10, "El teléfono debe tener al menos 10 dígitos"),

  localidadId: z
    .number({ error: "El localidadId es obligatorio y debe ser un número" })
    .int()
    .positive("La localidad debe ser un número entero positivo.")
});

// 2. SCHEMA PARA EL ADMIN: El admin SÍ debe elegir el rolId
export const crearUsuarioAdminSchema = usuarioBaseSchema.extend({
  rolId: z
    .number({ error: "El rolId es obligatorio"})
    .int()
    .positive("El rolId tiene que ser un numero entero positivo.")
});

// 3. SCHEMA PARA AUTO-REGISTRO: Sin rolId, pero con los datos de la postulación
export const registroUsuarioSchema = usuarioBaseSchema.extend({
  rubroId: z
    .number({ error: "El rubroId es obligatorio" })
    .int()
    .positive("El rubro tiene que ser un numero entero positivo."),

  nombre_emprendimiento: z
    .string({error: "El nombre es obligatorio y tiene que ser texto"})
    .min(3, "El nombre del emprendimiento debe tener mínimo 3 carácteres"),

  descripcion_emprendimiento: z
    .string({ error: "La descripción del emprendimiento es obligatoria" })
    .min(10, "Cuéntanos más sobre tu emprendimiento (mínimo 10 caracteres).")
});