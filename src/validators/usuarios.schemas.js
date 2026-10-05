import {z} from "zod";

export const crearUsuarioSchema = z.object({
  nombre: z.string({
    required_error: "El nombre es obligatorio",
    invalid_type_error: "El nombre debe ser un texto"
  }).min(3, "El nombre debe tener al menos 3 caracteres"),

  apellido: z.string({
    required_error: "El apellido es obligatorio",
    invalid_type_error: "El apellido debe ser un texto"
  }).min(3, "El apellido debe tener al menos 3 caracteres"),

  password: z.string({
    required_error: "La contraseña es obligatoria",
    invalid_type_error: "La contraseña debe ser texto"
  })
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .regex(/[a-zA-Z]/, "La contraseña debe contener al menos una letra")
  .regex(/[0-9]/, "La contraseña debe contener al menos un número")
  .regex(/[^a-zA-Z0-9]/, "La contraseña debe contener al menos un símbolo (ej: !@#$%&*)"),

  email: z.string({
    required_error: "El email es obligatorio",
    invalid_type_error: "El email debe ser un texto"
  }).email("El email debe ser válido"), 

  telefono: z.string({
    required_error: "El teléfono es obligatorio",
    invalid_type_error: "El teléfono debe ser un texto"
  }).regex(/^[0-9]+$/, "El teléfono solo debe contener números")
  .min(10, "El teléfono debe tener al menos 10 dígitos"),

   localidadId: z.number({
    required_error: "La localidad es obligatoria"
  }).int().positive(),


});

export const actualizarUsuarioSchema = z.object({
  nombre: z.string().min(3).optional(),
  apellido: z.string().min(3).optional(), 
  email: z.string().email().optional(),
  telefono: z.string().regex(/^[0-9]+$/, "El teléfono solo debe contener números").min(10, "El teléfono debe tener al menos 10 dígitos").optional(),
  localidadId: z.number().int().positive().optional()
}).refine((datos) => Object.keys(datos).length > 0, {
  // Este mensaje saldrá si envían un JSON vacío {}
  message: "Debe enviar por lo menos un dato válido para actualizar." 
});

export const consultarUsuarioSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sortBy: z.enum(['createdAt', 'id_usuario', 'nombre', 'apellido']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});


export const registroArtesanoSchema = crearUsuarioSchema.extend({
  rubroId: z.number({
    required_error: "El rubro es obligatorio",
    invalid_type_error: "El rubro debe ser un número"
  }).int().positive(),
  descripcion: z.string({
    required_error: "La descripción del emprendimiento es obligatoria",
    invalid_type_error: "La descripción debe ser texto"
  }).min(10, "Por favor, cuéntanos un poco más de tu emprendimiento (mínimo 10 letras)"),
});