import express from "express";
import {
  obtenerBusquedas,
  obtenerBusquedaPorId,
  crearBusqueda,
  eliminarBusqueda,
} from "../controllers/busqueda.controller.js";
import {
  validarBusqueda,
  validarConsultaBusqueda,
} from "../middlewares/validation/busquedas.middleware.js";
import { validarBusquedaId } from "../middlewares/base/validarId.js";
import { autenticarUsuario } from "../middlewares/auth/autenticacion.middleware.js";
import {
  cargarContextoUsuario,
  soloAdmin,
  organizadoresYAdmins,
} from "../middlewares/auth/autorizacion.middleware.js";

const router = express.Router();

const controlesGestion = [autenticarUsuario, cargarContextoUsuario, organizadoresYAdmins];
const controlesAdmin = [autenticarUsuario, cargarContextoUsuario, soloAdmin];

router.get(
  "/",
  /* #swagger.tags = ["Búsquedas"]
     #swagger.summary = "Listar registro de búsquedas"
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['termino_busqueda'] = { in: "query", description: "Término buscado.", "@schema": { type: "string" } }
     #swagger.parameters['rubroId'] = { in: "query", description: "ID del rubro.", "@schema": { type: "integer", minimum: 1 } }
     #swagger.parameters['pabellonId'] = { in: "query", description: "ID del pabellón.", "@schema": { type: "integer", minimum: 1 } }
     #swagger.parameters['localidadId'] = { in: "query", description: "ID de la localidad.", "@schema": { type: "integer", minimum: 1 } }
     #swagger.parameters['ordenarPor'] = { in: "query", description: "Campo de ordenamiento.", "@schema": { type: "string", enum: ["createdAt", "termino_busqueda"], default: "createdAt" } }
     #swagger.parameters['direccion'] = { in: "query", description: "Sentido del orden.", "@schema": { type: "string", enum: ["asc", "desc"], default: "desc" } }
     #swagger.parameters['pagina'] = { in: "query", description: "Página solicitada.", "@schema": { type: "integer", minimum: 1, default: 1 } }
     #swagger.parameters['limite'] = { in: "query", description: "Elementos por página.", "@schema": { type: "integer", minimum: 1, maximum: 50, default: 10 } }
     #swagger.responses[200] = { description: "Listado paginado de búsquedas." }
     #swagger.responses[400] = { description: "Filtros inválidos o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ORGANIZADOR o ADMINISTRADOR." }
  */
  ...controlesGestion,
  validarConsultaBusqueda,
  obtenerBusquedas
);

router.get(
  "/:id",
  /* #swagger.tags = ["Búsquedas"]
     #swagger.summary = "Consultar un registro de búsqueda por ID"
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.responses[200] = { description: "Detalle de la búsqueda." }
     #swagger.responses[400] = { description: "ID inválido o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ORGANIZADOR o ADMINISTRADOR." }
     #swagger.responses[404] = { description: "La búsqueda no existe." }
  */
  ...controlesGestion,
  validarBusquedaId,
  obtenerBusquedaPorId
);

router.post(
  "/",
  /* #swagger.tags = ["Búsquedas"]
     #swagger.summary = "Registrar una búsqueda"
     #swagger.auto = false
     #swagger.security = []
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/NuevaBusqueda" } }
     } }
     #swagger.responses[201] = { description: "Búsqueda registrada." }
     #swagger.responses[400] = { description: "Cuerpo inválido." }
  */
  validarBusqueda,
  crearBusqueda
);

router.delete(
  "/:id",
  /* #swagger.tags = ["Búsquedas"]
     #swagger.summary = "Eliminar un registro de búsqueda"
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.responses[204] = { description: "Búsqueda eliminada. Sin cuerpo de respuesta." }
     #swagger.responses[400] = { description: "ID inválido o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ADMINISTRADOR." }
     #swagger.responses[404] = { description: "La búsqueda no existe." }
  */
  ...controlesAdmin,
  validarBusquedaId,
  eliminarBusqueda
);

export default router;
