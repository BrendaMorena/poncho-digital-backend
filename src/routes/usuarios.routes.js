import express from "express";
import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  registrarUsuario,
  iniciarSesion,
  obtenerMiPerfil,
  cambiarActivo,
} from "../controllers/usuario.controller.js";
import {
  validarConsultaUsuarios,
  validarCrearUsuarioAdmin,
  validarActualizarUsuario,
  validarCrearUsuario,
  validarInicioSesion,
  validarActualizarActivo,
} from "../middlewares/validation/usuarios.middleware.js";
import { validarUsuarioId } from "../middlewares/base/validarId.js";
import { autenticarUsuario } from "../middlewares/auth/autenticacion.middleware.js";
import { cerrarSesion } from "../controllers/sesion.controller.js";
import {
  cargarContextoUsuario,
  soloAdmin,
} from "../middlewares/auth/autorizacion.middleware.js";

const router = express.Router();

const controlesAdmin = [autenticarUsuario, cargarContextoUsuario, soloAdmin];

// Rutas especiales y públicas
router.get(
  "/me",
  /* #swagger.tags = ["Usuarios"]
     #swagger.summary = "Consultar mi perfil de usuario"
     #swagger.description = "Devuelve los datos del usuario autenticado con su rol, solicitud y artesano."
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.responses[200] = { description: "Perfil del usuario autenticado.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/PerfilUsuario" } }
     } }
     #swagger.responses[400] = { description: "Cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" },
         example: { mensaje: "Se requiere un token de acceso." } }
     } }
     #swagger.responses[403] = { description: "Cuenta inactiva." }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  obtenerMiPerfil
);

router.post(
  "/registro",
  /* #swagger.tags = ["Usuarios"]
     #swagger.summary = "Registrar postulación de usuario artesano"
     #swagger.description = "Crea la cuenta con rol ARTESANO, su perfil de artesano INACTIVO y su solicitud en estado PENDIENTE. No permite enviar rol ni activo."
     #swagger.auto = false
     #swagger.security = []
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/RegistroUsuario" } }
     } }
     #swagger.responses[201] = { description: "Usuario y solicitud registrados con éxito.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/UsuarioRegistrado" } }
     } }
     #swagger.responses[400] = { description: "Datos de entrada inválidos." }
     #swagger.responses[404] = { description: "Localidad o rubro inexistente." }
     #swagger.responses[409] = { description: "El email o DNI ya existe en el sistema." }
  */
  validarCrearUsuario,
  registrarUsuario
); // En el mismo registro se realiza la postulación

router.post(
  "/login",
  /* #swagger.tags = ["Usuarios"]
     #swagger.summary = "Iniciar sesión y obtener JWT"
     #swagger.description = "Verifica las credenciales y devuelve un token JWT Bearer para autenticar solicitudes protegidas."
     #swagger.auto = false
     #swagger.security = []
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/LoginUsuario" } }
     } }
     #swagger.responses[200] = { description: "Credenciales verificadas y token emitido.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/RespuestaLogin" } }
     } }
     #swagger.responses[400] = { description: "Formato de email o contraseña inválido." }
     #swagger.responses[401] = { description: "Credenciales inválidas o cuenta inactiva.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" },
         example: { error: "Las credenciales son inválidas.", mensaje: "Las credenciales son inválidas." } }
     } }
  */
  validarInicioSesion,
  iniciarSesion
);

router.post(
  "/logout",
  /* #swagger.tags = ["Usuarios"]
     #swagger.summary = "Cerrar sesión y revocar token actual"
     #swagger.description = "Revoca el token JWT utilizado en la cabecera Authorization."
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.responses[204] = { description: "Sesión cerrada. Sin cuerpo de respuesta." }
     #swagger.responses[400] = { description: "Cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente, inválido, vencido o ya revocado.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" },
         example: { mensaje: "Se requiere un token de acceso." } }
     } }
  */
  autenticarUsuario,
  cerrarSesion
);

// Rutas CRUD (Solo ADMINISTRADOR: autenticación -> cuenta -> rol -> validación -> controlador)
router.get(
  "/",
  /* #swagger.tags = ["Usuarios"]
     #swagger.summary = "Listar usuarios"
     #swagger.description = "Requiere JWT, cuenta activa y rol ADMINISTRADOR."
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['nombre'] = { in: "query", description: "Coincidencia parcial por nombre.", "@schema": { type: "string" } }
     #swagger.parameters['apellido'] = { in: "query", description: "Coincidencia parcial por apellido.", "@schema": { type: "string" } }
     #swagger.parameters['dni'] = { in: "query", description: "Coincidencia parcial por DNI.", "@schema": { type: "string" } }
     #swagger.parameters['email'] = { in: "query", description: "Coincidencia parcial por email.", "@schema": { type: "string" } }
     #swagger.parameters['ordenarPor'] = { in: "query", description: "Campo de ordenamiento.", "@schema": { type: "string", enum: ["createdAt", "id_usuario", "nombre", "apellido"], default: "createdAt" } }
     #swagger.parameters['direccion'] = { in: "query", description: "Sentido del orden.", "@schema": { type: "string", enum: ["asc", "desc"], default: "desc" } }
     #swagger.parameters['pagina'] = { in: "query", description: "Página solicitada.", "@schema": { type: "integer", minimum: 1, default: 1 } }
     #swagger.parameters['limite'] = { in: "query", description: "Elementos por página.", "@schema": { type: "integer", minimum: 1, maximum: 100, default: 10 } }
     #swagger.responses[200] = { description: "Listado paginado de usuarios.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/ListadoUsuarios" } }
     } }
     #swagger.responses[400] = { description: "Filtros inválidos o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ADMINISTRADOR." }
  */
  ...controlesAdmin,
  validarConsultaUsuarios,
  obtenerUsuarios
);

router.get(
  "/:id",
  /* #swagger.tags = ["Usuarios"]
     #swagger.summary = "Consultar un usuario por ID"
     #swagger.description = "Requiere JWT, cuenta activa y rol ADMINISTRADOR."
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: "path", required: true, description: "UUID del usuario.", "@schema": { type: "string", format: "uuid" } }
     #swagger.responses[200] = { description: "Detalle del usuario.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/Usuario" } }
     } }
     #swagger.responses[400] = { description: "ID de usuario con formato UUID inválido o Bearer mal formado." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ADMINISTRADOR." }
     #swagger.responses[404] = { description: "El usuario no existe." }
  */
  ...controlesAdmin,
  validarUsuarioId,
  obtenerUsuarioPorId
);

router.post(
  "/",
  /* #swagger.tags = ["Usuarios"]
     #swagger.summary = "Crear un usuario (Administrador)"
     #swagger.description = "Permite a un ADMINISTRADOR dar de alta un usuario asignando su rolId."
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/NuevoUsuarioAdmin" } }
     } }
     #swagger.responses[201] = { description: "Usuario creado con éxito." }
     #swagger.responses[400] = { description: "Cuerpo inválido o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ADMINISTRADOR." }
     #swagger.responses[404] = { description: "Rol o localidad inexistente." }
     #swagger.responses[409] = { description: "El correo o DNI ya está registrado." }
  */
  ...controlesAdmin,
  validarCrearUsuarioAdmin,
  crearUsuario
);

router.patch(
  "/:id/activo",
  /* #swagger.tags = ["Usuarios"]
     #swagger.summary = "Activar o desactivar cuenta de usuario"
     #swagger.description = "Permite a un ADMINISTRADOR modificar el estado activo de una cuenta."
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: "path", required: true, description: "UUID del usuario.", "@schema": { type: "string", format: "uuid" } }
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/ActualizarActivoUsuario" } }
     } }
     #swagger.responses[200] = { description: "Estado activo actualizado." }
     #swagger.responses[400] = { description: "UUID o campo activo inválido, o Bearer mal formado." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ADMINISTRADOR." }
     #swagger.responses[404] = { description: "El usuario no existe." }
     #swagger.responses[409] = { description: "No se puede desactivar el último administrador activo." }
  */
  ...controlesAdmin,
  validarUsuarioId,
  validarActualizarActivo,
  cambiarActivo
);

router.patch(
  "/:id",
  /* #swagger.tags = ["Usuarios"]
     #swagger.summary = "Actualizar datos personales de un usuario"
     #swagger.description = "Requiere JWT, cuenta activa y rol ADMINISTRADOR."
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: "path", required: true, description: "UUID del usuario.", "@schema": { type: "string", format: "uuid" } }
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/ActualizarUsuario" } }
     } }
     #swagger.responses[200] = { description: "Usuario actualizado." }
     #swagger.responses[400] = { description: "UUID o cuerpo inválido, o Bearer mal formado." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ADMINISTRADOR." }
     #swagger.responses[404] = { description: "El usuario no existe." }
     #swagger.responses[409] = { description: "DNI o email duplicado." }
  */
  ...controlesAdmin,
  validarUsuarioId,
  validarActualizarUsuario,
  actualizarUsuario
);

router.delete(
  "/:id",
  /* #swagger.tags = ["Usuarios"]
     #swagger.summary = "Eliminar un usuario"
     #swagger.description = "Requiere JWT, cuenta activa y rol ADMINISTRADOR."
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: "path", required: true, description: "UUID del usuario.", "@schema": { type: "string", format: "uuid" } }
     #swagger.responses[200] = { description: "Usuario eliminado exitosamente." }
     #swagger.responses[400] = { description: "UUID inválido o Bearer mal formado." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ADMINISTRADOR." }
     #swagger.responses[404] = { description: "El usuario no existe." }
     #swagger.responses[409] = { description: "Debe quedar al menos un administrador activo o existen registros relacionados." }
  */
  ...controlesAdmin,
  validarUsuarioId,
  eliminarUsuario
);

export default router;
