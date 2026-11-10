import express from "express";
import {
  crearLocalidad,
  obtenerLocalidades,
  obtenerLocalidadPorId,
  actualizarLocalidad,
  eliminarLocalidad,
} from "../controllers/localidad.controller.js";
import {
  validarCreacionLocalidad,
  validarActualizacionLocalidad,
  validarConsultaLocalidades,
} from "../middlewares/validation/localidad.middleware.js";
import { validarLocalidadId } from "../middlewares/base/validarId.js";
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
  /* #swagger.tags = ["Localidades"]
     #swagger.summary = "Listar localidades"
     #swagger.auto = false
     #swagger.security = []
     #swagger.parameters['buscar'] = { in: "query", description: "Texto de búsqueda parcial.", "@schema": { type: "string" } }
     #swagger.parameters['ordenPor'] = { in: "query", description: "Campo de ordenamiento.", "@schema": { type: "string", enum: ["id_localidad", "nombre_locacion", "createdAt"], default: "id_localidad" } }
     #swagger.parameters['direccion'] = { in: "query", description: "Sentido del orden.", "@schema": { type: "string", enum: ["asc", "desc"], default: "asc" } }
     #swagger.parameters['pagina'] = { in: "query", description: "Página solicitada.", "@schema": { type: "integer", minimum: 1, default: 1 } }
     #swagger.parameters['limite'] = { in: "query", description: "Elementos por página.", "@schema": { type: "integer", minimum: 1, maximum: 50, default: 10 } }
     #swagger.responses[200] = { description: "Listado paginado de localidades." }
     #swagger.responses[400] = { description: "Filtros inválidos." }
  */
  validarConsultaLocalidades,
  obtenerLocalidades
);

router.get(
  "/:id",
  /* #swagger.tags = ["Localidades"]
     #swagger.summary = "Consultar una localidad por ID"
     #swagger.auto = false
     #swagger.security = []
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.responses[200] = { description: "Detalle de la localidad." }
     #swagger.responses[400] = { description: "ID inválido." }
     #swagger.responses[404] = { description: "La localidad no existe." }
  */
  validarLocalidadId,
  obtenerLocalidadPorId
);

router.post(
  "/",
  /* #swagger.tags = ["Localidades"]
     #swagger.summary = "Crear una localidad"
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/NuevaLocalidad" } }
     } }
     #swagger.responses[201] = { description: "Localidad creada." }
     #swagger.responses[400] = { description: "Cuerpo inválido o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ORGANIZADOR o ADMINISTRADOR." }
     #swagger.responses[409] = { description: "Ya existe una localidad con ese nombre." }
  */
  ...controlesGestion,
  validarCreacionLocalidad,
  crearLocalidad
);

router.put(
  "/:id",
  /* #swagger.tags = ["Localidades"]
     #swagger.summary = "Reemplazar una localidad"
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/ActualizarLocalidad" } }
     } }
     #swagger.responses[200] = { description: "Localidad actualizada." }
     #swagger.responses[400] = { description: "ID o cuerpo inválidos, o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ORGANIZADOR o ADMINISTRADOR." }
     #swagger.responses[404] = { description: "La localidad no existe." }
     #swagger.responses[409] = { description: "Nombre de localidad duplicado." }
  */
  ...controlesGestion,
  validarLocalidadId,
  validarActualizacionLocalidad,
  actualizarLocalidad
);

router.patch(
  "/:id",
  /* #swagger.tags = ["Localidades"]
     #swagger.summary = "Actualizar una localidad"
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/ActualizarLocalidad" } }
     } }
     #swagger.responses[200] = { description: "Localidad actualizada." }
     #swagger.responses[400] = { description: "ID o cuerpo inválidos, o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ORGANIZADOR o ADMINISTRADOR." }
     #swagger.responses[404] = { description: "La localidad no existe." }
     #swagger.responses[409] = { description: "Nombre de localidad duplicado." }
  */
  ...controlesGestion,
  validarLocalidadId,
  validarActualizacionLocalidad,
  actualizarLocalidad
);

router.delete(
  "/:id",
  /* #swagger.tags = ["Localidades"]
     #swagger.summary = "Eliminar una localidad"
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.responses[204] = { description: "Localidad eliminada. Sin cuerpo de respuesta." }
     #swagger.responses[400] = { description: "ID inválido, localidad con registros asociados o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ADMINISTRADOR." }
     #swagger.responses[404] = { description: "La localidad no existe." }
  */
  ...controlesAdmin,
  validarLocalidadId,
  eliminarLocalidad
);

export default router;
