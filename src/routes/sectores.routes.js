import express from "express";
import {
  obtenerSectores,
  obtenerSectorPorId,
  crearSector,
  actualizarSector,
  eliminarSector,
} from "../controllers/sector.controller.js";
import {
  validarSector,
  validarActualizarSector,
  validarConsultaSectores,
} from "../middlewares/validation/sectores.middleware.js";
import { validarSectorId } from "../middlewares/base/validarId.js";
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
  /* #swagger.tags = ["Sectores"]
     #swagger.summary = "Listar sectores"
     #swagger.auto = false
     #swagger.security = []
     #swagger.parameters['nombre_sector'] = { in: "query", description: "Coincidencia parcial por nombre.", "@schema": { type: "string" } }
     #swagger.parameters['codigo_sector'] = { in: "query", description: "Coincidencia parcial por código.", "@schema": { type: "string" } }
     #swagger.parameters['pabellonId'] = { in: "query", description: "ID del pabellón.", "@schema": { type: "integer", minimum: 1 } }
     #swagger.parameters['rubroId'] = { in: "query", description: "ID del rubro.", "@schema": { type: "integer", minimum: 1 } }
     #swagger.parameters['ordenarPor'] = { in: "query", description: "Campo de ordenamiento.", "@schema": { type: "string", enum: ["nombre_sector", "codigo_sector", "createdAt"], default: "nombre_sector" } }
     #swagger.parameters['direccion'] = { in: "query", description: "Sentido del orden.", "@schema": { type: "string", enum: ["asc", "desc"], default: "asc" } }
     #swagger.parameters['pagina'] = { in: "query", description: "Página solicitada.", "@schema": { type: "integer", minimum: 1, default: 1 } }
     #swagger.parameters['limite'] = { in: "query", description: "Elementos por página.", "@schema": { type: "integer", minimum: 1, maximum: 50, default: 10 } }
     #swagger.responses[200] = { description: "Listado paginado de sectores." }
     #swagger.responses[400] = { description: "Filtros inválidos." }
  */
  validarConsultaSectores,
  obtenerSectores
);

router.get(
  "/:id",
  /* #swagger.tags = ["Sectores"]
     #swagger.summary = "Consultar un sector por ID"
     #swagger.auto = false
     #swagger.security = []
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.responses[200] = { description: "Detalle del sector." }
     #swagger.responses[400] = { description: "ID inválido." }
     #swagger.responses[404] = { description: "El sector no existe." }
  */
  validarSectorId,
  obtenerSectorPorId
);

router.post(
  "/",
  /* #swagger.tags = ["Sectores"]
     #swagger.summary = "Crear un sector"
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/NuevoSector" } }
     } }
     #swagger.responses[201] = { description: "Sector creado." }
     #swagger.responses[400] = { description: "Cuerpo inválido o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ORGANIZADOR o ADMINISTRADOR." }
     #swagger.responses[404] = { description: "Pabellón o rubro inexistente." }
     #swagger.responses[409] = { description: "El código o nombre del sector ya está en uso." }
  */
  ...controlesGestion,
  validarSector,
  crearSector
);

router.patch(
  "/:id",
  /* #swagger.tags = ["Sectores"]
     #swagger.summary = "Actualizar un sector"
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/ActualizarSector" } }
     } }
     #swagger.responses[200] = { description: "Sector actualizado." }
     #swagger.responses[400] = { description: "ID o cuerpo inválidos, o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ORGANIZADOR o ADMINISTRADOR." }
     #swagger.responses[404] = { description: "Sector, pabellón o rubro inexistente." }
     #swagger.responses[409] = { description: "El código o nombre del sector ya está en uso." }
  */
  ...controlesGestion,
  validarSectorId,
  validarActualizarSector,
  actualizarSector
);

router.delete(
  "/:id",
  /* #swagger.tags = ["Sectores"]
     #swagger.summary = "Eliminar un sector"
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.responses[204] = { description: "Sector eliminado. Sin cuerpo de respuesta." }
     #swagger.responses[400] = { description: "ID inválido, sector con stands asociados o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ADMINISTRADOR." }
     #swagger.responses[404] = { description: "El sector no existe." }
  */
  ...controlesAdmin,
  validarSectorId,
  eliminarSector
);

export default router;
