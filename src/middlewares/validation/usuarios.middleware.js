import {
  consultarUsuarioSchema,
  crearUsuarioAdminSchema,
  actualizarUsuarioSchema,
  registroUsuarioSchema,
  loginSchema,
} from "../../validators/usuarios.schema.js";
import { validarSchemaBody, validarSchemaQuery } from "../base/validarSchema.js";

export const validarConsultaUsuarios = validarSchemaQuery(consultarUsuarioSchema, "consultaUsuariosDTO", "Los datos enviados para consultar el usuario son inválidos");
export const validarCrearUsuarioAdmin = validarSchemaBody(crearUsuarioAdminSchema, "crearUsuarioDTO", "Los datos enviados para el usuario son inválidos");
export const validarActualizarUsuario = validarSchemaBody(actualizarUsuarioSchema, "actualizarUsuarioDTO", "Los datos enviados para actualizar el usuario son inválidos");

export const validarCrearUsuario = validarSchemaBody(registroUsuarioSchema, "registroUsuarioDTO", "Los datos enviados para el registro de usuario son inválidos");
export const validarInicioSesion = validarSchemaBody(loginSchema, "iniciarSesionDTO", "Los datos enviados para el inicio de sesión son inválidos");