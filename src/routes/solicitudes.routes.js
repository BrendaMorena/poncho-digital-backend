import express from "express";
import {
  crearSolicitud,
  obtenerSolicitudes,
  obtenerSolicitudPorId,
  obtenerMiSolicitud,
  actualizarMiSolicitud,
  cancelarMiSolicitud,
  aprobarSolicitud,
  rechazarSolicitud,
  solicitarModificacion,
  actualizarSolicitud,
  eliminarSolicitud,
} from "../controllers/solicitud.controller.js";
import {
  validarCreacionSolicitud,
  validarAprobacionSolicitud,
  validarRechazoSolicitud,
  validarSolicitudModificacion,
  validarActualizacionSolicitud,
  validarConsultaSolicitudes,
} from "../middlewares/validation/solicitudes.middleware.js";
import { validarSolicitudId } from "../middlewares/base/validarId.js";
import { autenticarUsuario } from "../middlewares/auth/autenticacion.middleware.js";
import {
  cargarContextoUsuario,
  soloAdmin,
  organizadoresYAdmins,
  soloArtesano,
} from "../middlewares/auth/autorizacion.middleware.js";

const router = express.Router();

// --- Rutas de recurso propio para ARTESANO ---
router.get(
  "/me",
  /* #swagger.tags = ["Solicitudes"]
     #swagger.summary = "Consultar mi solicitud de postulación"
     #swagger.description = "JWT, cuenta activa y rol ARTESANO. Devuelve únicamente la solicitud propia del usuario autenticado."
     #swagger.auto = false
     #swagger.responses[200] = { description: "Detalle de mi solicitud.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/Solicitud" } }
     } }
     #swagger.responses[400] = { description: "Cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" },
         example: { mensaje: "Se requiere un token de acceso." } }
     } }
     #swagger.responses[403] = { description: "Cuenta inactiva o rol ARTESANO requerido." }
     #swagger.responses[404] = { description: "No posee una solicitud registrada en el sistema." }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  soloArtesano,
  obtenerMiSolicitud
);

router.patch(
  "/me",
  /* #swagger.tags = ["Solicitudes"]
     #swagger.summary = "Actualizar mi solicitud de postulación"
     #swagger.description = "JWT, cuenta activa y rol ARTESANO. Permite corregir los datos del emprendimiento y vuelve la solicitud a estado PENDIENTE."
     #swagger.auto = false
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/ActualizarSolicitud" } }
     } }
     #swagger.responses[200] = { description: "Solicitud propia actualizada." }
     #swagger.responses[400] = { description: "Cuerpo inválido o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Cuenta inactiva o rol ARTESANO requerido." }
     #swagger.responses[404] = { description: "Solicitud o rubro inexistente." }
     #swagger.responses[409] = { description: "No se puede modificar una solicitud ya aprobada." }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  soloArtesano,
  validarActualizacionSolicitud,
  actualizarMiSolicitud
);

router.delete(
  "/me",
  /* #swagger.tags = ["Solicitudes"]
     #swagger.summary = "Cancelar mi solicitud de postulación"
     #swagger.description = "JWT, cuenta activa y rol ARTESANO. Elimina la solicitud propia si aún no fue aprobada."
     #swagger.auto = false
     #swagger.responses[204] = { description: "Solicitud cancelada. Sin cuerpo de respuesta." }
     #swagger.responses[400] = { description: "Cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Cuenta inactiva o rol ARTESANO requerido." }
     #swagger.responses[404] = { description: "No posee una solicitud registrada en el sistema." }
     #swagger.responses[409] = { description: "No se puede cancelar una solicitud que ya ha sido aprobada." }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  soloArtesano,
  cancelarMiSolicitud
);

// Rutas administrativas (ORGANIZADOR y ADMINISTRADOR)
router.get(
  "/",
  /* #swagger.tags = ["Solicitudes"]
     #swagger.summary = "Listar solicitudes de postulación"
     #swagger.description = "Requiere JWT, cuenta activa y rol ORGANIZADOR o ADMINISTRADOR."
     #swagger.auto = false
     #swagger.parameters['estado_solicitud'] = { in: "query", description: "Filtrar por estado.", "@schema": { type: "string", enum: ["APROBADO", "RECHAZADO", "PENDIENTE", "MODIFICACION_SOLICITADA"] } }
     #swagger.parameters['usuarioId'] = { in: "query", description: "UUID del usuario solicitante.", "@schema": { type: "string", format: "uuid" } }
     #swagger.parameters['rubroId'] = { in: "query", description: "ID del rubro artesanal.", "@schema": { type: "integer", minimum: 1 } }
     #swagger.parameters['ordenPor'] = { in: "query", description: "Campo de ordenamiento.", "@schema": { type: "string", enum: ["id_solicitud", "estado_solicitud", "createdAt"], default: "id_solicitud" } }
     #swagger.parameters['direccion'] = { in: "query", description: "Sentido del orden.", "@schema": { type: "string", enum: ["asc", "desc"], default: "desc" } }
     #swagger.parameters['pagina'] = { in: "query", description: "Página solicitada.", "@schema": { type: "integer", minimum: 1, default: 1 } }
     #swagger.parameters['limite'] = { in: "query", description: "Elementos por página.", "@schema": { type: "integer", minimum: 1, maximum: 50, default: 10 } }
     #swagger.responses[200] = { description: "Listado paginado de solicitudes.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/ListadoSolicitudes" } }
     } }
     #swagger.responses[400] = { description: "Filtros inválidos o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ORGANIZADOR o ADMINISTRADOR." }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarConsultaSolicitudes,
  obtenerSolicitudes
);

router.get(
  "/:id",
  /* #swagger.tags = ["Solicitudes"]
     #swagger.summary = "Consultar una solicitud por ID"
     #swagger.description = "Requiere JWT, cuenta activa y rol ORGANIZADOR o ADMINISTRADOR."
     #swagger.auto = false
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.responses[200] = { description: "Detalle de la solicitud.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/Solicitud" } }
     } }
     #swagger.responses[400] = { description: "ID inválido o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ORGANIZADOR o ADMINISTRADOR." }
     #swagger.responses[404] = { description: "La solicitud no existe." }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarSolicitudId,
  obtenerSolicitudPorId
);

router.post(
  "/",
  /* #swagger.tags = ["Solicitudes"]
     #swagger.summary = "Crear mi solicitud de postulación"
     #swagger.description = "JWT, cuenta activa y rol ARTESANO. Solicitud propia: el usuarioId se obtiene del token y el estado inicial es PENDIENTE."
     #swagger.auto = false
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/NuevaSolicitud" } }
     } }
     #swagger.responses[201] = { description: "Solicitud creada.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/SolicitudCreada" } }
     } }
     #swagger.responses[400] = { description: "Cuerpo inválido o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" },
         example: { mensaje: "Se requiere un token de acceso." } }
     } }
     #swagger.responses[403] = { description: "Cuenta inactiva o rol ARTESANO requerido." }
     #swagger.responses[404] = { description: "Rubro inexistente." }
     #swagger.responses[409] = { description: "El usuario ya cuenta con una solicitud registrada o ya es artesano activo." }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  soloArtesano,
  validarCreacionSolicitud,
  crearSolicitud
);

router.patch(
  "/:id/aprobar",
  /* #swagger.tags = ["Solicitudes"]
     #swagger.summary = "Aprobar una solicitud de postulación"
     #swagger.description = "Requiere JWT y rol ORGANIZADOR o ADMINISTRADOR. Pasa la solicitud a APROBADO y habilita al artesano como ACTIVO."
     #swagger.auto = false
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.requestBody = { required: false, content: {
       "application/json": { schema: { $ref: "#/components/schemas/AprobarSolicitud" } }
     } }
     #swagger.responses[200] = { description: "Solicitud aprobada y artesano habilitado." }
     #swagger.responses[400] = { description: "ID o cuerpo inválidos, o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ORGANIZADOR o ADMINISTRADOR." }
     #swagger.responses[404] = { description: "La solicitud no existe." }
     #swagger.responses[409] = { description: "La solicitud no está en estado PENDIENTE o el artesano ya está activo." }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarSolicitudId,
  validarAprobacionSolicitud,
  aprobarSolicitud
);

router.patch(
  "/:id/rechazar",
  /* #swagger.tags = ["Solicitudes"]
     #swagger.summary = "Rechazar una solicitud de postulación"
     #swagger.description = "Requiere JWT y rol ORGANIZADOR o ADMINISTRADOR. Exige indicar el motivo en observaciones_admin."
     #swagger.auto = false
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/RechazarSolicitud" } }
     } }
     #swagger.responses[200] = { description: "Solicitud rechazada correctamente." }
     #swagger.responses[400] = { description: "ID o cuerpo inválidos, o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ORGANIZADOR o ADMINISTRADOR." }
     #swagger.responses[404] = { description: "La solicitud no existe." }
     #swagger.responses[409] = { description: "Solo se pueden rechazar solicitudes en estado PENDIENTE." }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarSolicitudId,
  validarRechazoSolicitud,
  rechazarSolicitud
);

router.patch(
  "/:id/solicitar-modificacion",
  /* #swagger.tags = ["Solicitudes"]
     #swagger.summary = "Solicitar modificaciones en una postulación"
     #swagger.description = "Requiere JWT y rol ORGANIZADOR o ADMINISTRADOR. Pasa la solicitud a MODIFICACION_SOLICITADA detallando las observaciones."
     #swagger.auto = false
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/SolicitarModificacion" } }
     } }
     #swagger.responses[200] = { description: "Modificación solicitada al artesano." }
     #swagger.responses[400] = { description: "ID o cuerpo inválidos, o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ORGANIZADOR o ADMINISTRADOR." }
     #swagger.responses[404] = { description: "La solicitud no existe." }
     #swagger.responses[409] = { description: "Solo se pueden solicitar modificaciones en estado PENDIENTE." }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarSolicitudId,
  validarSolicitudModificacion,
  solicitarModificacion
);

router.patch(
  "/:id",
  /* #swagger.tags = ["Solicitudes"]
     #swagger.summary = "Actualizar una solicitud por ID"
     #swagger.description = "Requiere JWT y rol ORGANIZADOR o ADMINISTRADOR."
     #swagger.auto = false
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/ActualizarSolicitud" } }
     } }
     #swagger.responses[200] = { description: "Solicitud actualizada y devuelta a estado PENDIENTE." }
     #swagger.responses[400] = { description: "ID o cuerpo inválidos, o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ORGANIZADOR o ADMINISTRADOR." }
     #swagger.responses[404] = { description: "Solicitud o rubro inexistente." }
     #swagger.responses[409] = { description: "No se pueden modificar los datos de una solicitud ya aprobada." }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarSolicitudId,
  validarActualizacionSolicitud,
  actualizarSolicitud
);

router.delete(
  "/:id",
  /* #swagger.tags = ["Solicitudes"]
     #swagger.summary = "Eliminar una solicitud por ID"
     #swagger.description = "Requiere JWT y rol ORGANIZADOR o ADMINISTRADOR. No permite eliminar solicitudes aprobadas."
     #swagger.auto = false
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.responses[204] = { description: "Solicitud eliminada. Sin cuerpo de respuesta." }
     #swagger.responses[400] = { description: "ID inválido o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ORGANIZADOR o ADMINISTRADOR." }
     #swagger.responses[404] = { description: "La solicitud no existe." }
     #swagger.responses[409] = { description: "No se puede eliminar una solicitud aprobada." }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarSolicitudId,
  eliminarSolicitud
);

export default router;
