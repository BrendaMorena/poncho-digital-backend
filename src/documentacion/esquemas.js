import { z } from "zod";
import {
  loginSchema,
  registroUsuarioSchema,
  crearUsuarioAdminSchema,
  actualizarUsuarioSchema,
  actualizarActivoSchema,
} from "../validators/usuarios.schema.js";
import {
  crearArtesanoSchema,
  actualizarArtesanoSchema,
} from "../validators/artesanos.schema.js";
import {
  crearProductoSchema,
  actualizarProductoSchema,
} from "../validators/productos.schema.js";
import {
  standSchema,
  actualizarStandSchema,
  asignarStandSchema,
} from "../validators/stands.schema.js";
import {
  crearSolicitudSchema,
  actualizarSolicitudSchema,
  aprobarSolicitudSchema,
  rechazarSolicitudSchema,
  solicitarModificacionSchema,
} from "../validators/solicitudes.schema.js";
import {
  pabellonSchema,
  actualizarPabellonSchema,
} from "../validators/pabellones.schema.js";
import {
  sectorSchema,
  actualizarSectorSchema,
} from "../validators/sectores.schema.js";
import {
  crearRubroSchema,
  actualizarRubroSchema,
} from "../validators/rubros.schema.js";
import {
  crearLocalidadSchema,
  actualizarLocalidadSchema,
} from "../validators/localidad.schema.js";
import {
  rolSchema,
  actualizarRolSchema,
} from "../validators/roles.schema.js";
import { busquedaSchema } from "../validators/busqueda.schema.js";

// ==========================================
// ESQUEMAS COMUNES (ERROR Y PAGINACIÓN)
// ==========================================

export const ErrorApi = {
  type: "object",
  required: ["mensaje"],
  properties: {
    error: { type: "string" },
    mensaje: { type: "string" },
  },
};

export const Paginacion = {
  type: "object",
  required: ["pagina", "limite", "total", "totalPaginas"],
  properties: {
    pagina: { type: "integer", minimum: 1 },
    limite: { type: "integer", minimum: 1, maximum: 100 },
    total: { type: "integer", minimum: 0 },
    totalPaginas: { type: "integer", minimum: 0 },
  },
  example: {
    pagina: 1,
    limite: 10,
    total: 1,
    totalPaginas: 1,
  },
};

// ==========================================
// MÓDULO USUARIOS (/usuarios)
// ==========================================

export const LoginUsuario = {
  ...z.toJSONSchema(loginSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    email: "artesano@ponchodigital.com",
    password: "Password123",
  },
};

export const RegistroUsuario = {
  ...z.toJSONSchema(registroUsuarioSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    nombre: "María",
    apellido: "Gómez",
    dni: "38123456",
    email: "maria.gomez@ponchodigital.com",
    password: "Password123",
    telefono: "3834123456",
    localidadId: 1,
    rubroId: 1,
    nombre_emprendimiento: "Tejidos Belén",
    descripcion_emprendimiento: "Elaboración artesanal de ponchos y prendas en fibra de vicuña y llama.",
  },
};

export const NuevoUsuarioAdmin = {
  ...z.toJSONSchema(crearUsuarioAdminSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    nombre: "Carlos",
    apellido: "Ruiz",
    dni: "30987654",
    email: "carlos.ruiz@ponchodigital.com",
    password: "Password123",
    telefono: "3834654321",
    localidadId: 1,
    rolId: 2,
  },
};

export const ActualizarUsuario = {
  ...z.toJSONSchema(actualizarUsuarioSchema, {
    target: "openapi-3.0",
    io: "input",
    unrepresentable: "any",
  }),
  example: {
    nombre: "María Elena",
    telefono: "3834999888",
  },
};

export const ActualizarActivoUsuario = {
  ...z.toJSONSchema(actualizarActivoSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    activo: true,
  },
};

export const RespuestaLogin = {
  type: "object",
  required: ["mensaje", "token", "usuario"],
  properties: {
    mensaje: { type: "string" },
    token: { type: "string" },
    usuario: {
      type: "object",
      required: ["id_usuario", "nombre", "apellido"],
      properties: {
        id_usuario: { type: "string", format: "uuid" },
        nombre: { type: "string" },
        apellido: { type: "string" },
      },
    },
  },
  example: {
    mensaje: "Credenciales verificadas correctamente.",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    usuario: {
      id_usuario: "550e8400-e29b-41d4-a716-446655440000",
      nombre: "María",
      apellido: "Gómez",
    },
  },
};

export const UsuarioRegistrado = {
  type: "object",
  required: ["id_usuario", "nombre", "apellido", "activo", "createdAt", "artesano", "solicitud"],
  properties: {
    id_usuario: { type: "string", format: "uuid" },
    nombre: { type: "string" },
    apellido: { type: "string" },
    activo: { type: "boolean" },
    createdAt: { type: "string", format: "date-time" },
    artesano: {
      type: "object",
      required: ["id_artesano", "estado"],
      properties: {
        id_artesano: { type: "integer" },
        estado: { type: "string", enum: ["ACTIVO", "INACTIVO", "SUSPENDIDO"] },
      },
    },
    solicitud: {
      type: "object",
      required: ["id_solicitud", "estado_solicitud"],
      properties: {
        id_solicitud: { type: "integer" },
        estado_solicitud: {
          type: "string",
          enum: ["PENDIENTE", "APROBADO", "RECHAZADO", "MODIFICACION_SOLICITADA"],
        },
      },
    },
  },
  example: {
    id_usuario: "550e8400-e29b-41d4-a716-446655440000",
    nombre: "María",
    apellido: "Gómez",
    activo: true,
    createdAt: "2026-10-20T12:00:00.000Z",
    artesano: { id_artesano: 10, estado: "INACTIVO" },
    solicitud: { id_solicitud: 5, estado_solicitud: "PENDIENTE" },
  },
};

export const Usuario = {
  type: "object",
  required: ["id_usuario", "nombre", "apellido", "email", "activo", "rol"],
  properties: {
    id_usuario: { type: "string", format: "uuid" },
    nombre: { type: "string" },
    apellido: { type: "string" },
    email: { type: "string", format: "email" },
    activo: { type: "boolean" },
    rol: { type: "string" },
    solicitud: {
      type: "object",
      nullable: true,
      properties: {
        id_solicitud: { type: "integer" },
        estado_solicitud: { type: "string" },
      },
    },
    artesano: {
      type: "object",
      nullable: true,
      properties: {
        id_artesano: { type: "integer" },
        estado: { type: "string" },
      },
    },
  },
  example: {
    id_usuario: "550e8400-e29b-41d4-a716-446655440000",
    nombre: "María",
    apellido: "Gómez",
    email: "maria.gomez@ponchodigital.com",
    activo: true,
    rol: "ARTESANO",
    solicitud: { id_solicitud: 5, estado_solicitud: "APROBADO" },
    artesano: { id_artesano: 10, estado: "ACTIVO" },
  },
};

export const PerfilUsuario = {
  type: "object",
  required: ["usuario"],
  properties: {
    usuario: { $ref: "#/components/schemas/Usuario" },
  },
  example: {
    usuario: Usuario.example,
  },
};

export const ListadoUsuarios = {
  type: "object",
  required: ["usuarios", "paginacion"],
  properties: {
    usuarios: {
      type: "array",
      items: {
        type: "object",
        required: ["id_usuario", "nombre", "apellido", "email", "activo", "rol"],
        properties: {
          id_usuario: { type: "string", format: "uuid" },
          nombre: { type: "string" },
          apellido: { type: "string" },
          email: { type: "string", format: "email" },
          activo: { type: "boolean" },
          rol: {
            type: "object",
            required: ["nombre"],
            properties: { nombre: { type: "string" } },
          },
        },
      },
    },
    paginacion: { $ref: "#/components/schemas/Paginacion" },
  },
  example: {
    usuarios: [
      {
        id_usuario: "550e8400-e29b-41d4-a716-446655440000",
        nombre: "María",
        apellido: "Gómez",
        email: "maria.gomez@ponchodigital.com",
        activo: true,
        rol: { nombre: "ARTESANO" },
      },
    ],
    paginacion: Paginacion.example,
  },
};

// ==========================================
// MÓDULO PRODUCTOS (/productos)
// ==========================================

// Reutiliza crearProductoSchema (.strict()): solo admite nombre_producto y precio (sin artesanoId).
export const NuevoProducto = {
  ...z.toJSONSchema(crearProductoSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    nombre_producto: "Poncho de Vicuña Tradicional",
    precio: 450000,
  },
};

// Reutiliza actualizarProductoSchema (.strict()): no admite artesanoId.
export const ActualizarProducto = {
  ...z.toJSONSchema(actualizarProductoSchema, {
    target: "openapi-3.0",
    io: "input",
    unrepresentable: "any",
  }),
  example: {
    nombre_producto: "Poncho de Vicuña Bordado",
    precio: 480000,
  },
};

export const ProductoCreado = {
  type: "object",
  required: ["id_producto", "nombre_producto", "precio", "artesanoId", "createdAt", "updatedAt"],
  properties: {
    id_producto: { type: "integer" },
    nombre_producto: { type: "string" },
    precio: { type: "number" },
    artesanoId: { type: "integer" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
  example: {
    id_producto: 1,
    nombre_producto: "Poncho de Vicuña Tradicional",
    precio: 450000,
    artesanoId: 10,
    createdAt: "2026-10-20T12:00:00.000Z",
    updatedAt: "2026-10-20T12:00:00.000Z",
  },
};

export const Producto = {
  type: "object",
  required: ["id_producto", "nombre_producto", "precio", "artesano"],
  properties: {
    id_producto: { type: "integer" },
    nombre_producto: { type: "string" },
    precio: { type: "number" },
    artesanoId: { type: "integer" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    artesano: {
      type: "object",
      required: ["id_artesano", "nombre_emprendimiento"],
      properties: {
        id_artesano: { type: "integer" },
        nombre_emprendimiento: { type: "string", nullable: true },
        descripcion_emprendimiento: { type: "string" },
        rubro: {
          type: "object",
          properties: {
            id_rubro: { type: "integer" },
            nombre_rubro: { type: "string" },
          },
        },
        usuario: {
          type: "object",
          properties: {
            nombre: { type: "string" },
            apellido: { type: "string" },
            telefono: { type: "string" },
          },
        },
      },
    },
  },
  example: {
    id_producto: 1,
    nombre_producto: "Poncho de Vicuña Tradicional",
    precio: 450000,
    artesanoId: 10,
    createdAt: "2026-10-20T12:00:00.000Z",
    updatedAt: "2026-10-20T12:00:00.000Z",
    artesano: {
      id_artesano: 10,
      nombre_emprendimiento: "Tejidos Belén",
      descripcion_emprendimiento: "Elaboración artesanal de ponchos y prendas en fibra de vicuña y llama.",
      rubro: { id_rubro: 1, nombre_rubro: "Textil" },
      usuario: { nombre: "María", apellido: "Gómez", telefono: "3834123456" },
    },
  },
};

export const MisProductos = {
  type: "array",
  items: {
    type: "object",
    required: ["id_producto", "nombre_producto", "precio", "createdAt", "updatedAt"],
    properties: {
      id_producto: { type: "integer" },
      nombre_producto: { type: "string" },
      precio: { type: "number" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  example: [
    {
      id_producto: 1,
      nombre_producto: "Poncho de Vicuña Tradicional",
      precio: 450000,
      createdAt: "2026-10-20T12:00:00.000Z",
      updatedAt: "2026-10-20T12:00:00.000Z",
    },
  ],
};

export const ListadoProductos = {
  type: "object",
  required: ["productos", "paginacion"],
  properties: {
    productos: {
      type: "array",
      items: {
        type: "object",
        required: ["id_producto", "nombre_producto", "precio", "artesano"],
        properties: {
          id_producto: { type: "integer" },
          nombre_producto: { type: "string" },
          precio: { type: "number" },
          artesano: {
            type: "object",
            required: ["id_artesano", "nombre_emprendimiento", "rubro"],
            properties: {
              id_artesano: { type: "integer" },
              nombre_emprendimiento: { type: "string", nullable: true },
              rubro: {
                type: "object",
                required: ["id_rubro", "nombre_rubro"],
                properties: {
                  id_rubro: { type: "integer" },
                  nombre_rubro: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    paginacion: { $ref: "#/components/schemas/Paginacion" },
  },
  example: {
    productos: [
      {
        id_producto: 1,
        nombre_producto: "Poncho de Vicuña Tradicional",
        precio: 450000,
        artesano: {
          id_artesano: 10,
          nombre_emprendimiento: "Tejidos Belén",
          rubro: { id_rubro: 1, nombre_rubro: "Textil" },
        },
      },
    ],
    paginacion: Paginacion.example,
  },
};

// ==========================================
// MÓDULO SOLICITUDES (/solicitudes)
// ==========================================

// Reutiliza crearSolicitudSchema: recibe nombre_emprendimiento, descripcion_emprendimiento y rubroId (sin usuarioId ni estado).
export const NuevaSolicitud = {
  ...z.toJSONSchema(crearSolicitudSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    nombre_emprendimiento: "Tejidos Belén",
    descripcion_emprendimiento: "Elaboración artesanal de ponchos y prendas en fibra de vicuña y llama.",
    rubroId: 1,
  },
};

export const ActualizarSolicitud = {
  ...z.toJSONSchema(actualizarSolicitudSchema, {
    target: "openapi-3.0",
    io: "input",
    unrepresentable: "any",
  }),
  example: {
    nombre_emprendimiento: "Tejidos Tradicionales Belén",
    descripcion_emprendimiento: "Tejidos artesanales en telar criollo con fibra natural certificada.",
    rubroId: 1,
  },
};

export const AprobarSolicitud = {
  ...z.toJSONSchema(aprobarSolicitudSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    observaciones_admin: "Documentación y piezas verificadas correctamente.",
  },
};

export const RechazarSolicitud = {
  ...z.toJSONSchema(rechazarSolicitudSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    observaciones_admin: "No cumple con los requisitos de producción artesanal propia.",
  },
};

export const SolicitarModificacion = {
  ...z.toJSONSchema(solicitarModificacionSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    observaciones_admin: "Por favor ampliar la descripción de las técnicas utilizadas.",
  },
};

export const SolicitudCreada = {
  type: "object",
  required: ["mensaje", "solicitud"],
  properties: {
    mensaje: { type: "string" },
    solicitud: {
      type: "object",
      required: ["id_solicitud", "estado_solicitud"],
      properties: {
        id_solicitud: { type: "integer" },
        estado_solicitud: {
          type: "string",
          enum: ["PENDIENTE", "APROBADO", "RECHAZADO", "MODIFICACION_SOLICITADA"],
        },
      },
    },
  },
  example: {
    mensaje: "Solicitud registrada con éxito en estado PENDIENTE",
    solicitud: {
      id_solicitud: 5,
      estado_solicitud: "PENDIENTE",
    },
  },
};

export const Solicitud = {
  type: "object",
  required: [
    "id_solicitud",
    "estado_solicitud",
    "nombre_emprendimiento",
    "descripcion_emprendimiento",
    "createdAt",
    "updatedAt",
    "usuario",
    "rubro",
  ],
  properties: {
    id_solicitud: { type: "integer" },
    estado_solicitud: {
      type: "string",
      enum: ["PENDIENTE", "APROBADO", "RECHAZADO", "MODIFICACION_SOLICITADA"],
    },
    nombre_emprendimiento: { type: "string", nullable: true },
    descripcion_emprendimiento: { type: "string" },
    observaciones_admin: { type: "string", nullable: true },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    usuario: {
      type: "object",
      required: ["id_usuario", "nombre", "apellido", "email", "telefono"],
      properties: {
        id_usuario: { type: "string", format: "uuid" },
        nombre: { type: "string" },
        apellido: { type: "string" },
        email: { type: "string", format: "email" },
        telefono: { type: "string" },
      },
    },
    rubro: {
      type: "object",
      required: ["id_rubro", "nombre_rubro"],
      properties: {
        id_rubro: { type: "integer" },
        nombre_rubro: { type: "string" },
      },
    },
  },
  example: {
    id_solicitud: 5,
    estado_solicitud: "PENDIENTE",
    nombre_emprendimiento: "Tejidos Belén",
    descripcion_emprendimiento: "Elaboración artesanal de ponchos y prendas en fibra de vicuña y llama.",
    observaciones_admin: null,
    createdAt: "2026-10-20T12:00:00.000Z",
    updatedAt: "2026-10-20T12:00:00.000Z",
    usuario: {
      id_usuario: "550e8400-e29b-41d4-a716-446655440000",
      nombre: "María",
      apellido: "Gómez",
      email: "maria.gomez@ponchodigital.com",
      telefono: "3834123456",
    },
    rubro: {
      id_rubro: 1,
      nombre_rubro: "Textil",
    },
  },
};

export const ListadoSolicitudes = {
  type: "object",
  required: ["solicitudes", "paginacion"],
  properties: {
    solicitudes: {
      type: "array",
      items: {
        type: "object",
        required: ["id_solicitud", "nombre_emprendimiento", "estado_solicitud", "createdAt", "usuario", "rubro"],
        properties: {
          id_solicitud: { type: "integer" },
          nombre_emprendimiento: { type: "string", nullable: true },
          estado_solicitud: {
            type: "string",
            enum: ["PENDIENTE", "APROBADO", "RECHAZADO", "MODIFICACION_SOLICITADA"],
          },
          createdAt: { type: "string", format: "date-time" },
          usuario: {
            type: "object",
            required: ["id_usuario", "nombre", "apellido"],
            properties: {
              id_usuario: { type: "string", format: "uuid" },
              nombre: { type: "string" },
              apellido: { type: "string" },
            },
          },
          rubro: {
            type: "object",
            required: ["id_rubro", "nombre_rubro"],
            properties: {
              id_rubro: { type: "integer" },
              nombre_rubro: { type: "string" },
            },
          },
        },
      },
    },
    paginacion: { $ref: "#/components/schemas/Paginacion" },
  },
  example: {
    solicitudes: [
      {
        id_solicitud: 5,
        nombre_emprendimiento: "Tejidos Belén",
        estado_solicitud: "PENDIENTE",
        createdAt: "2026-10-20T12:00:00.000Z",
        usuario: {
          id_usuario: "550e8400-e29b-41d4-a716-446655440000",
          nombre: "María",
          apellido: "Gómez",
        },
        rubro: { id_rubro: 1, nombre_rubro: "Textil" },
      },
    ],
    paginacion: Paginacion.example,
  },
};

// ==========================================
// MÓDULO ARTESANOS (/artesanos)
// ==========================================

export const NuevoArtesano = {
  ...z.toJSONSchema(crearArtesanoSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    nombre_emprendimiento: "Tejidos Belén",
    descripcion_emprendimiento: "Elaboración artesanal de ponchos y prendas en fibra de vicuña y llama.",
    usuarioId: "550e8400-e29b-41d4-a716-446655440000",
    rubroId: 1,
  },
};

export const ActualizarArtesano = {
  ...z.toJSONSchema(actualizarArtesanoSchema, {
    target: "openapi-3.0",
    io: "input",
    unrepresentable: "any",
  }),
  example: {
    nombre_emprendimiento: "Tejidos Belén",
    descripcion_emprendimiento: "Elaboración artesanal de ponchos y prendas en fibra de vicuña y llama.",
    rubroId: 1,
  },
};

export const Artesano = {
  type: "object",
  required: [
    "id_artesano",
    "nombre_emprendimiento",
    "descripcion_emprendimiento",
    "estado",
    "usuarioId",
    "rubroId",
    "usuario",
    "rubro",
  ],
  properties: {
    id_artesano: { type: "integer" },
    nombre_emprendimiento: { type: "string", nullable: true },
    descripcion_emprendimiento: { type: "string" },
    estado: { type: "string", enum: ["ACTIVO", "INACTIVO", "SUSPENDIDO"] },
    usuarioId: { type: "string", format: "uuid" },
    rubroId: { type: "integer" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    usuario: {
      type: "object",
      required: ["nombre", "apellido"],
      properties: {
        id_usuario: { type: "string", format: "uuid" },
        nombre: { type: "string" },
        apellido: { type: "string" },
        email: { type: "string", format: "email" },
        telefono: { type: "string" },
        localidad: {
          type: "object",
          properties: {
            id_localidad: { type: "integer" },
            nombre_locacion: { type: "string" },
          },
        },
      },
    },
    rubro: {
      type: "object",
      required: ["nombre_rubro"],
      properties: {
        id_rubro: { type: "integer" },
        nombre_rubro: { type: "string" },
      },
    },
    stand: {
      type: "object",
      nullable: true,
      properties: {
        id_stand: { type: "integer" },
        numero_stand: { type: "integer" },
        sector: {
          type: "object",
          properties: {
            nombre_sector: { type: "string" },
            pabellon: {
              type: "object",
              properties: { nombre_pabellon: { type: "string" } },
            },
          },
        },
      },
    },
  },
  example: {
    id_artesano: 10,
    nombre_emprendimiento: "Tejidos Belén",
    descripcion_emprendimiento: "Elaboración artesanal de ponchos y prendas en fibra de vicuña y llama.",
    estado: "ACTIVO",
    usuarioId: "550e8400-e29b-41d4-a716-446655440000",
    rubroId: 1,
    createdAt: "2026-10-20T12:00:00.000Z",
    updatedAt: "2026-10-20T12:00:00.000Z",
    usuario: {
      nombre: "María",
      apellido: "Gómez",
      localidad: { id_localidad: 1, nombre_locacion: "Belén" },
    },
    rubro: { id_rubro: 1, nombre_rubro: "Textil" },
    stand: {
      numero_stand: 12,
      sector: {
        nombre_sector: "Sector Textil Norte",
        pabellon: { nombre_pabellon: "Pabellón Peregrina Zárate" },
      },
    },
  },
};

export const ListadoArtesanos = {
  type: "object",
  required: ["artesanos", "paginacion"],
  properties: {
    artesanos: {
      type: "array",
      items: { $ref: "#/components/schemas/Artesano" },
    },
    paginacion: { $ref: "#/components/schemas/Paginacion" },
  },
  example: {
    artesanos: [Artesano.example],
    paginacion: Paginacion.example,
  },
};

// ==========================================
// MÓDULO STANDS (/stands)
// ==========================================

// Reutiliza standSchema (omite estado): solo recibe numero_stand, coordenada y sectorId.
export const NuevoStand = {
  ...z.toJSONSchema(standSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    numero_stand: 15,
    coordenada: { lat: -28.4696, lng: -65.7795 },
    sectorId: 1,
  },
};

export const ActualizarStand = {
  ...z.toJSONSchema(actualizarStandSchema, {
    target: "openapi-3.0",
    io: "input",
    unrepresentable: "any",
  }),
  example: {
    numero_stand: 15,
    estado: "MANTENIMIENTO",
  },
};

export const AsignarStand = {
  ...z.toJSONSchema(asignarStandSchema, {
    target: "openapi-3.0",
    io: "input",
  }),
  example: {
    artesanoId: 10,
    standId: 15,
  },
};

export const Stand = {
  type: "object",
  required: ["id_stand", "numero_stand", "estado", "sector"],
  properties: {
    id_stand: { type: "integer" },
    numero_stand: { type: "integer" },
    estado: { type: "string", enum: ["DISPONIBLE", "OCUPADO", "MANTENIMIENTO"] },
    coordenada: {
      type: "object",
      properties: {
        lat: { type: "number" },
        lng: { type: "number" },
      },
    },
    artesanoId: { type: "integer", nullable: true },
    sectorId: { type: "integer" },
    sector: {
      type: "object",
      required: ["id_sector", "codigo_sector", "nombre_sector"],
      properties: {
        id_sector: { type: "integer" },
        codigo_sector: { type: "string" },
        nombre_sector: { type: "string" },
        pabellon: {
          type: "object",
          nullable: true,
          properties: {
            id_pabellon: { type: "integer" },
            nombre_pabellon: { type: "string" },
          },
        },
      },
    },
    artesano: {
      type: "object",
      nullable: true,
      properties: {
        id_artesano: { type: "integer" },
        nombre_emprendimiento: { type: "string", nullable: true },
      },
    },
  },
  example: {
    id_stand: 15,
    numero_stand: 15,
    estado: "OCUPADO",
    sector: {
      id_sector: 1,
      codigo_sector: "SEC-A1",
      nombre_sector: "Sector Textil Norte",
      pabellon: {
        id_pabellon: 1,
        nombre_pabellon: "Pabellón Peregrina Zárate",
      },
    },
    artesano: {
      id_artesano: 10,
      nombre_emprendimiento: "Tejidos Belén",
    },
  },
};

export const ListadoStands = {
  type: "object",
  required: ["stands", "paginacion"],
  properties: {
    stands: {
      type: "array",
      items: { $ref: "#/components/schemas/Stand" },
    },
    paginacion: {
      type: "object",
      nullable: true,
      properties: Paginacion.properties,
    },
  },
  example: {
    stands: [Stand.example],
    paginacion: Paginacion.example,
  },
};

// ==========================================
// ESQUEMAS DE CATÁLOGOS AUXILIARES
// ==========================================

export const NuevoPabellon = {
  ...z.toJSONSchema(pabellonSchema, { target: "openapi-3.0", io: "input" }),
  example: {
    nombre_pabellon: "Pabellón Peregrina Zárate",
    descripcion_pabellon: "Pabellón principal de artesanías tradicionales.",
  },
};

export const ActualizarPabellon = {
  ...z.toJSONSchema(actualizarPabellonSchema, {
    target: "openapi-3.0",
    io: "input",
    unrepresentable: "any",
  }),
  example: {
    descripcion_pabellon: "Pabellón principal renovado de artesanías.",
  },
};

export const NuevoSector = {
  ...z.toJSONSchema(sectorSchema, { target: "openapi-3.0", io: "input" }),
  example: {
    codigo_sector: "SEC-A1",
    nombre_sector: "Sector Textil Norte",
    pabellonId: 1,
    rubroId: 1,
  },
};

export const ActualizarSector = {
  ...z.toJSONSchema(actualizarSectorSchema, {
    target: "openapi-3.0",
    io: "input",
    unrepresentable: "any",
  }),
  example: {
    nombre_sector: "Sector Textil Principal",
  },
};

export const NuevoRubro = {
  ...z.toJSONSchema(crearRubroSchema, { target: "openapi-3.0", io: "input" }),
  example: {
    nombre_rubro: "Textil",
  },
};

export const ActualizarRubro = {
  ...z.toJSONSchema(actualizarRubroSchema, {
    target: "openapi-3.0",
    io: "input",
    unrepresentable: "any",
  }),
  example: {
    nombre_rubro: "Textil y Fibra Animal",
  },
};

export const NuevaLocalidad = {
  ...z.toJSONSchema(crearLocalidadSchema, { target: "openapi-3.0", io: "input" }),
  example: {
    nombre_locacion: "Belén",
  },
};

export const ActualizarLocalidad = {
  ...z.toJSONSchema(actualizarLocalidadSchema, {
    target: "openapi-3.0",
    io: "input",
    unrepresentable: "any",
  }),
  example: {
    nombre_locacion: "San Fernando del Valle de Catamarca",
  },
};

export const NuevoRol = {
  ...z.toJSONSchema(rolSchema, { target: "openapi-3.0", io: "input" }),
  example: {
    nombre: "ORGANIZADOR",
    descripcion: "Encargado de evaluar solicitudes y gestionar stands.",
  },
};

export const ActualizarRol = {
  ...z.toJSONSchema(actualizarRolSchema, {
    target: "openapi-3.0",
    io: "input",
    unrepresentable: "any",
  }),
  example: {
    descripcion: "Rol con permisos de gestión de feria.",
  },
};

export const NuevaBusqueda = {
  ...z.toJSONSchema(busquedaSchema, {
    target: "openapi-3.0",
    io: "input",
    unrepresentable: "any",
  }),
  example: {
    termino_busqueda: "poncho",
    rubroId: 1,
    pabellonId: 1,
    localidadId: 1,
  },
};
