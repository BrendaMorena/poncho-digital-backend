import express from "express";
import {
  obtenerArtesanos,
  obtenerArtesanoPorId,
  obtenerMiArtesano,
  actualizarMiArtesano,
  crearArtesano,
  actualizarArtesano,
  eliminarArtesano,
} from "../controllers/artesano.controller.js";
import {
  validarCreacionArtesano,
  validarActualizarArtesano,
  validarConsultaArtesanos,
} from "../middlewares/validation/artesanos.middleware.js";
import { validarArtesanoId } from "../middlewares/base/validarId.js";
import { autenticarUsuario } from "../middlewares/auth/autenticacion.middleware.js";
import {
  cargarContextoUsuario,
  soloAdmin,
  organizadoresYAdmins,
  soloArtesano,
} from "../middlewares/auth/autorizacion.middleware.js";

const router = express.Router();

// Rutas públicas (GET /me va ANTES de GET /:id)
router.get(
  "/",
  /* #swagger.tags = ["Artesanos"]
     #swagger.summary = "Listar artesanos activos"
     #swagger.description = "Acceso público. Devuelve los artesanos en estado ACTIVO de forma paginada."
     #swagger.auto = false
     #swagger.security = []
     #swagger.parameters['ordenarPor'] = { in: "query", description: "Campo de ordenamiento.", "@schema": { type: "string", enum: ["createdAt", "id_artesano", "nombre", "apellido"], default: "createdAt" } }
     #swagger.parameters['direccion'] = { in: "query", description: "Sentido del orden.", "@schema": { type: "string", enum: ["asc", "desc"], default: "desc" } }
     #swagger.parameters['pagina'] = { in: "query", description: "Página solicitada.", "@schema": { type: "integer", minimum: 1, default: 1 } }
     #swagger.parameters['limite'] = { in: "query", description: "Elementos por página.", "@schema": { type: "integer", minimum: 1, maximum: 100, default: 10 } }
     #swagger.responses[200] = { description: "Listado paginado de artesanos.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/ListadoArtesanos" } }
     } }
     #swagger.responses[400] = { description: "Parámetros de consulta inválidos." }
  */
  validarConsultaArtesanos,
  obtenerArtesanos
);

// --- Rutas de recurso propio para ARTESANO ---
router.get(
  "/me",
  /* #swagger.tags = ["Artesanos"]
     #swagger.summary = "Consultar mi perfil de artesano"
     #swagger.description = "JWT, cuenta activa y rol ARTESANO. Devuelve únicamente el perfil de artesano asociado al usuario autenticado."
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.responses[200] = { description: "Perfil de artesano propio.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/Artesano" } }
     } }
     #swagger.responses[400] = { description: "Cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" },
         example: { mensaje: "Se requiere un token de acceso." } }
     } }
     #swagger.responses[403] = { description: "Cuenta inactiva o rol ARTESANO requerido." }
     #swagger.responses[404] = { description: "No posee un perfil de artesano registrado en el sistema." }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  soloArtesano,
  obtenerMiArtesano
);

router.patch(
  "/me",
  /* #swagger.tags = ["Artesanos"]
     #swagger.summary = "Actualizar mi perfil de artesano"
     #swagger.description = "JWT, cuenta activa y rol ARTESANO. Permite actualizar emprendimiento y rubro propios (sin modificar estado ni usuarioId)."
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/ActualizarArtesano" } }
     } }
     #swagger.responses[200] = { description: "Perfil de artesano actualizado.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/Artesano" } }
     } }
     #swagger.responses[400] = { description: "Cuerpo inválido o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Cuenta inactiva o rol ARTESANO requerido." }
     #swagger.responses[404] = { description: "Artesano o rubro inexistente." }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  soloArtesano,
  validarActualizarArtesano,
  actualizarMiArtesano
);

router.get(
  "/:id",
  /* #swagger.tags = ["Artesanos"]
     #swagger.summary = "Consultar un artesano por ID"
     #swagger.description = "Acceso público."
     #swagger.auto = false
     #swagger.security = []
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.responses[200] = { description: "Detalle del artesano.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/Artesano" } }
     } }
     #swagger.responses[400] = { description: "ID inválido." }
     #swagger.responses[404] = { description: "El artesano no existe.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" },
         example: { error: "El artesano no existe.", mensaje: "El artesano no existe." } }
     } }
  */
  validarArtesanoId,
  obtenerArtesanoPorId
);

// Rutas administrativas (ORGANIZADOR y ADMINISTRADOR)
router.post(
  "/",
  /* #swagger.tags = ["Artesanos"]
     #swagger.summary = "Registrar un artesano (Gestión)"
     #swagger.description = "Requiere JWT, cuenta activa y rol ORGANIZADOR o ADMINISTRADOR."
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/NuevoArtesano" } }
     } }
     #swagger.responses[201] = { description: "Artesano creado.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/Artesano" } }
     } }
     #swagger.responses[400] = { description: "Cuerpo inválido o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere rol ORGANIZADOR o ADMINISTRADOR." }
     #swagger.responses[404] = { description: "Usuario o rubro inexistente." }
     #swagger.responses[409] = { description: "El usuario ya se encuentra registrado como artesano." }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarCreacionArtesano,
  crearArtesano
);

router.patch(
  "/:id",
  /* #swagger.tags = ["Artesanos"]
     #swagger.summary = "Actualizar un artesano por ID"
     #swagger.description = "Requiere JWT, cuenta activa y rol ORGANIZADOR o ADMINISTRADOR."
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/ActualizarArtesano" } }
     } }
     #swagger.responses[200] = { description: "Artesano actualizado.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/Artesano" } }
     } }
     #swagger.responses[400] = { description: "ID o cuerpo inválidos, o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere rol ORGANIZADOR o ADMINISTRADOR." }
     #swagger.responses[404] = { description: "Artesano o rubro inexistente." }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarArtesanoId,
  validarActualizarArtesano,
  actualizarArtesano
);

router.delete(
  "/:id",
  /* #swagger.tags = ["Artesanos"]
     #swagger.summary = "Dar de baja un artesano"
     #swagger.description = "Requiere JWT, cuenta activa y rol ADMINISTRADOR. Realiza baja lógica (INACTIVO) y libera su stand si tenía uno asignado."
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.responses[200] = { description: "Artesano dado de baja exitosamente." }
     #swagger.responses[400] = { description: "ID inválido o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ADMINISTRADOR." }
     #swagger.responses[404] = { description: "El artesano no existe." }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  soloAdmin,
  validarArtesanoId,
  eliminarArtesano
);

export default router;
