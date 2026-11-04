import express from "express";
import {
  obtenerStands,
  obtenerStandPorId,
  crearStand,
  actualizarStand,
  eliminarStand,
  asignarStand,
  liberarStand,
} from "../controllers/stand.controller.js";
import {
  validarStand,
  validarActualizarStand,
  validarConsultaStands,
  validarAsignarStand,
} from "../middlewares/validation/stands.middleware.js";
import { validarStandId } from "../middlewares/base/validarId.js";
import { capturarBusqueda } from "../middlewares/validation/busquedas.middleware.js";
import { autenticarUsuario } from "../middlewares/auth/autenticacion.middleware.js";
import {
  cargarContextoUsuario,
  soloAdmin,
  organizadoresYAdmins,
} from "../middlewares/auth/autorizacion.middleware.js";

const router = express.Router();

// Rutas públicas
router.get(
  "/",
  /* #swagger.tags = ["Stands"]
     #swagger.summary = "Listar stands del predio"
     #swagger.description = "Acceso público. Permite filtrar por número, estado, sector y rubro."
     #swagger.auto = false
     #swagger.security = []
     #swagger.parameters['numero_stand'] = { in: "query", description: "Número exacto del stand.", "@schema": { type: "integer", minimum: 1 } }
     #swagger.parameters['estado'] = { in: "query", description: "Estado del stand.", "@schema": { type: "string", enum: ["DISPONIBLE", "OCUPADO", "MANTENIMIENTO"] } }
     #swagger.parameters['sectorId'] = { in: "query", description: "ID del sector.", "@schema": { type: "integer", minimum: 1 } }
     #swagger.parameters['rubroId'] = { in: "query", description: "ID del rubro del artesano ocupante.", "@schema": { type: "integer", minimum: 1 } }
     #swagger.parameters['ordenarPor'] = { in: "query", description: "Campo de ordenamiento.", "@schema": { type: "string", enum: ["numero_stand", "rubro"], default: "numero_stand" } }
     #swagger.parameters['direccion'] = { in: "query", description: "Sentido del orden.", "@schema": { type: "string", enum: ["asc", "desc"], default: "asc" } }
     #swagger.parameters['pagina'] = { in: "query", description: "Página solicitada.", "@schema": { type: "integer", minimum: 1 } }
     #swagger.parameters['limite'] = { in: "query", description: "Elementos por página.", "@schema": { type: "integer", minimum: 1, maximum: 50 } }
     #swagger.responses[200] = { description: "Listado de stands.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/ListadoStands" } }
     } }
     #swagger.responses[400] = { description: "Filtros de consulta inválidos." }
  */
  validarConsultaStands,
  capturarBusqueda,
  obtenerStands
);

router.get(
  "/:id",
  /* #swagger.tags = ["Stands"]
     #swagger.summary = "Consultar un stand por ID"
     #swagger.description = "Acceso público."
     #swagger.auto = false
     #swagger.security = []
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.responses[200] = { description: "Detalle del stand.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/Stand" } }
     } }
     #swagger.responses[400] = { description: "ID inválido." }
     #swagger.responses[404] = { description: "El stand no existe.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" },
         example: { error: "No existe el Stand con id 99", mensaje: "No existe el Stand con id 99" } }
     } }
  */
  validarStandId,
  obtenerStandPorId
);

// Rutas de gestión de stands (ORGANIZADOR y ADMINISTRADOR)
router.post(
  "/",
  /* #swagger.tags = ["Stands"]
     #swagger.summary = "Crear un stand"
     #swagger.description = "Requiere JWT, cuenta activa y rol ORGANIZADOR o ADMINISTRADOR. Se crea en estado DISPONIBLE."
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/NuevoStand" } }
     } }
     #swagger.responses[201] = { description: "Stand creado.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/Stand" } }
     } }
     #swagger.responses[400] = { description: "Cuerpo inválido o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" },
         example: { mensaje: "Se requiere un token de acceso." } }
     } }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ORGANIZADOR o ADMINISTRADOR." }
     #swagger.responses[404] = { description: "El sector indicado no existe." }
     #swagger.responses[409] = { description: "El número de stand ya existe en el sistema." }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarStand,
  crearStand
);

router.post(
  "/asignar",
  /* #swagger.tags = ["Stands"]
     #swagger.summary = "Asignar stand a un artesano activo"
     #swagger.description = "Requiere JWT y rol ORGANIZADOR o ADMINISTRADOR. Asigna el stand indicado o busca automáticamente uno disponible del rubro del artesano."
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/AsignarStand" } }
     } }
     #swagger.responses[200] = { description: "Stand asignado al artesano.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/Stand" } }
     } }
     #swagger.responses[400] = { description: "Cuerpo inválido, artesano no activo o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ORGANIZADOR o ADMINISTRADOR." }
     #swagger.responses[404] = { description: "Artesano o stand inexistente." }
     #swagger.responses[409] = { description: "El artesano ya tiene stand o no hay stands disponibles." }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarAsignarStand,
  asignarStand
);

router.patch(
  "/:id/liberar",
  /* #swagger.tags = ["Stands"]
     #swagger.summary = "Liberar un stand ocupado"
     #swagger.description = "Requiere JWT y rol ORGANIZADOR o ADMINISTRADOR. Desvincula al artesano y pasa el stand a DISPONIBLE."
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.responses[200] = { description: "Stand liberado.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/Stand" } }
     } }
     #swagger.responses[400] = { description: "ID inválido, stand ya disponible o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ORGANIZADOR o ADMINISTRADOR." }
     #swagger.responses[404] = { description: "El stand no existe." }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarStandId,
  liberarStand
);

router.patch(
  "/:id",
  /* #swagger.tags = ["Stands"]
     #swagger.summary = "Actualizar un stand"
     #swagger.description = "Requiere JWT y rol ORGANIZADOR o ADMINISTRADOR."
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/ActualizarStand" } }
     } }
     #swagger.responses[200] = { description: "Stand actualizado.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/Stand" } }
     } }
     #swagger.responses[400] = { description: "ID o cuerpo inválidos, o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ORGANIZADOR o ADMINISTRADOR." }
     #swagger.responses[404] = { description: "Stand o sector inexistente." }
     #swagger.responses[409] = { description: "El número de stand ya está en uso." }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarStandId,
  validarActualizarStand,
  actualizarStand
);

router.delete(
  "/:id",
  /* #swagger.tags = ["Stands"]
     #swagger.summary = "Eliminar un stand"
     #swagger.description = "Requiere JWT y rol ORGANIZADOR o ADMINISTRADOR. No permite eliminar stands ocupados por un artesano."
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.responses[204] = { description: "Stand eliminado. Sin cuerpo de respuesta." }
     #swagger.responses[400] = { description: "ID inválido, stand con artesano asignado o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ORGANIZADOR o ADMINISTRADOR." }
     #swagger.responses[404] = { description: "El stand no existe." }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarStandId,
  eliminarStand
);

export default router;
