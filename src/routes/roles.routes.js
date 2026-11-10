import express from "express";
import {
  obtenerRoles,
  obtenerRolPorId,
  crearRol,
  actualizarRol,
  eliminarRol,
} from "../controllers/rol.controller.js";
import {
  validarRol,
  validarActualizarRol,
  validarConsultaRoles,
} from "../middlewares/validation/roles.middleware.js";
import { validarRolId } from "../middlewares/base/validarId.js";
import { autenticarUsuario } from "../middlewares/auth/autenticacion.middleware.js";
import {
  cargarContextoUsuario,
  soloAdmin,
} from "../middlewares/auth/autorizacion.middleware.js";

const router = express.Router();

const controlesAdmin = [autenticarUsuario, cargarContextoUsuario, soloAdmin];

router.get(
  "/",
  /* #swagger.tags = ["Roles"]
     #swagger.summary = "Listar roles del sistema"
     #swagger.auto = false
     #swagger.parameters['nombre'] = { in: "query", description: "Coincidencia parcial por nombre del rol.", "@schema": { type: "string" } }
     #swagger.parameters['ordenarPor'] = { in: "query", description: "Campo de ordenamiento.", "@schema": { type: "string", enum: ["nombre", "createdAt"], default: "nombre" } }
     #swagger.parameters['direccion'] = { in: "query", description: "Sentido del orden.", "@schema": { type: "string", enum: ["asc", "desc"], default: "asc" } }
     #swagger.parameters['pagina'] = { in: "query", description: "Página solicitada.", "@schema": { type: "integer", minimum: 1, default: 1 } }
     #swagger.parameters['limite'] = { in: "query", description: "Elementos por página.", "@schema": { type: "integer", minimum: 1, maximum: 50, default: 10 } }
     #swagger.responses[200] = { description: "Listado paginado de roles." }
     #swagger.responses[400] = { description: "Filtros inválidos o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ADMINISTRADOR." }
  */
  ...controlesAdmin,
  validarConsultaRoles,
  obtenerRoles
);

router.get(
  "/:id",
  /* #swagger.tags = ["Roles"]
     #swagger.summary = "Consultar un rol por ID"
     #swagger.auto = false
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.responses[200] = { description: "Detalle del rol." }
     #swagger.responses[400] = { description: "ID inválido o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ADMINISTRADOR." }
     #swagger.responses[404] = { description: "El rol no existe." }
  */
  ...controlesAdmin,
  validarRolId,
  obtenerRolPorId
);

router.post(
  "/",
  /* #swagger.tags = ["Roles"]
     #swagger.summary = "Crear un rol"
     #swagger.auto = false
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/NuevoRol" } }
     } }
     #swagger.responses[201] = { description: "Rol creado." }
     #swagger.responses[400] = { description: "Cuerpo inválido o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ADMINISTRADOR." }
     #swagger.responses[409] = { description: "El nombre del rol ya existe." }
  */
  ...controlesAdmin,
  validarRol,
  crearRol
);

router.patch(
  "/:id",
  /* #swagger.tags = ["Roles"]
     #swagger.summary = "Actualizar un rol"
     #swagger.auto = false
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/ActualizarRol" } }
     } }
     #swagger.responses[200] = { description: "Rol actualizado." }
     #swagger.responses[400] = { description: "ID o cuerpo inválidos, o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ADMINISTRADOR." }
     #swagger.responses[404] = { description: "El rol no existe." }
     #swagger.responses[409] = { description: "El nombre del rol ya está en uso." }
  */
  ...controlesAdmin,
  validarRolId,
  validarActualizarRol,
  actualizarRol
);

router.delete(
  "/:id",
  /* #swagger.tags = ["Roles"]
     #swagger.summary = "Eliminar un rol"
     #swagger.auto = false
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.responses[204] = { description: "Rol eliminado. Sin cuerpo de respuesta." }
     #swagger.responses[400] = { description: "ID inválido, rol con usuarios asociados o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ADMINISTRADOR." }
     #swagger.responses[404] = { description: "El rol no existe." }
  */
  ...controlesAdmin,
  validarRolId,
  eliminarRol
);

export default router;
