import express from "express";
import {
  obtenerPabellones,
  obtenerPabellonPorId,
  crearPabellon,
  actualizarPabellon,
  eliminarPabellon,
} from "../controllers/pabellon.controller.js";
import {
  validarPabellon,
  validarActualizarPabellon,
  validarConsultaPabellones,
} from "../middlewares/validation/pabellones.middleware.js";
import { validarPabellonId } from "../middlewares/base/validarId.js";
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
  /* #swagger.tags = ["Pabellones"]
     #swagger.summary = "Listar pabellones"
     #swagger.auto = false
     #swagger.security = []
     #swagger.parameters['nombre_pabellon'] = { in: "query", description: "Coincidencia parcial por nombre.", "@schema": { type: "string" } }
     #swagger.parameters['ordenarPor'] = { in: "query", description: "Campo de ordenamiento.", "@schema": { type: "string", enum: ["nombre_pabellon", "createdAt"], default: "nombre_pabellon" } }
     #swagger.parameters['direccion'] = { in: "query", description: "Sentido del orden.", "@schema": { type: "string", enum: ["asc", "desc"], default: "asc" } }
     #swagger.parameters['pagina'] = { in: "query", description: "Página solicitada.", "@schema": { type: "integer", minimum: 1, default: 1 } }
     #swagger.parameters['limite'] = { in: "query", description: "Elementos por página.", "@schema": { type: "integer", minimum: 1, maximum: 50, default: 10 } }
     #swagger.responses[200] = { description: "Listado paginado de pabellones." }
     #swagger.responses[400] = { description: "Filtros inválidos." }
  */
  validarConsultaPabellones,
  obtenerPabellones
);

router.get(
  "/:id",
  /* #swagger.tags = ["Pabellones"]
     #swagger.summary = "Consultar un pabellón por ID"
     #swagger.auto = false
     #swagger.security = []
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.responses[200] = { description: "Detalle del pabellón." }
     #swagger.responses[400] = { description: "ID inválido." }
     #swagger.responses[404] = { description: "El pabellón no existe." }
  */
  validarPabellonId,
  obtenerPabellonPorId
);

router.post(
  "/",
  /* #swagger.tags = ["Pabellones"]
     #swagger.summary = "Crear un pabellón"
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/NuevoPabellon" } }
     } }
     #swagger.responses[201] = { description: "Pabellón creado." }
     #swagger.responses[400] = { description: "Cuerpo inválido o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ORGANIZADOR o ADMINISTRADOR." }
     #swagger.responses[409] = { description: "El nombre del pabellón ya está en uso." }
  */
  ...controlesGestion,
  validarPabellon,
  crearPabellon
);

router.patch(
  "/:id",
  /* #swagger.tags = ["Pabellones"]
     #swagger.summary = "Actualizar un pabellón"
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/ActualizarPabellon" } }
     } }
     #swagger.responses[200] = { description: "Pabellón actualizado." }
     #swagger.responses[400] = { description: "ID o cuerpo inválidos, o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ORGANIZADOR o ADMINISTRADOR." }
     #swagger.responses[404] = { description: "El pabellón no existe." }
     #swagger.responses[409] = { description: "El nombre del pabellón ya está en uso." }
  */
  ...controlesGestion,
  validarPabellonId,
  validarActualizarPabellon,
  actualizarPabellon
);

router.delete(
  "/:id",
  /* #swagger.tags = ["Pabellones"]
     #swagger.summary = "Eliminar un pabellón"
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.responses[204] = { description: "Pabellón eliminado. Sin cuerpo de respuesta." }
     #swagger.responses[400] = { description: "ID inválido, pabellón con sectores asociados o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ADMINISTRADOR." }
     #swagger.responses[404] = { description: "El pabellón no existe." }
  */
  ...controlesAdmin,
  validarPabellonId,
  eliminarPabellon
);

export default router;
