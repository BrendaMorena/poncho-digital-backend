import express from "express";
import {
  obtenerRubros,
  obtenerRubroPorId,
  crearRubro,
  actualizarRubro,
  eliminarRubro,
} from "../controllers/rubro.controller.js";
import {
  validarCreacionRubro,
  validarActualizarRubro,
} from "../middlewares/validation/rubros.middleware.js";
import { validarRubroId } from "../middlewares/base/validarId.js";
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
  /* #swagger.tags = ["Rubros"]
     #swagger.summary = "Listar rubros artesanales"
     #swagger.auto = false
     #swagger.security = []
     #swagger.responses[200] = { description: "Listado de rubros." }
  */
  obtenerRubros
);

router.get(
  "/:id",
  /* #swagger.tags = ["Rubros"]
     #swagger.summary = "Consultar un rubro por ID"
     #swagger.auto = false
     #swagger.security = []
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.responses[200] = { description: "Detalle del rubro." }
     #swagger.responses[400] = { description: "ID inválido." }
     #swagger.responses[404] = { description: "El rubro no existe." }
  */
  validarRubroId,
  obtenerRubroPorId
);

// RUTAS PRIVADAS (autenticación -> cuenta -> rol -> validación -> controlador)
router.post(
  "/",
  /* #swagger.tags = ["Rubros"]
     #swagger.summary = "Crear un rubro artesanal"
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/NuevoRubro" } }
     } }
     #swagger.responses[201] = { description: "Rubro creado." }
     #swagger.responses[400] = { description: "Cuerpo inválido o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ORGANIZADOR o ADMINISTRADOR." }
     #swagger.responses[409] = { description: "Ya existe un rubro con ese nombre." }
  */
  ...controlesGestion,
  validarCreacionRubro,
  crearRubro
);

router.patch(
  "/:id",
  /* #swagger.tags = ["Rubros"]
     #swagger.summary = "Actualizar un rubro artesanal"
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/ActualizarRubro" } }
     } }
     #swagger.responses[200] = { description: "Rubro actualizado." }
     #swagger.responses[400] = { description: "ID o cuerpo inválidos, o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ORGANIZADOR o ADMINISTRADOR." }
     #swagger.responses[404] = { description: "El rubro no existe." }
     #swagger.responses[409] = { description: "Ya existe otro rubro con ese nombre." }
  */
  ...controlesGestion,
  validarRubroId,
  validarActualizarRubro,
  actualizarRubro
);

router.delete(
  "/:id",
  /* #swagger.tags = ["Rubros"]
     #swagger.summary = "Eliminar un rubro artesanal"
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.responses[204] = { description: "Rubro eliminado. Sin cuerpo de respuesta." }
     #swagger.responses[400] = { description: "ID inválido o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Se requiere cuenta activa con rol ADMINISTRADOR." }
     #swagger.responses[404] = { description: "El rubro no existe." }
     #swagger.responses[409] = { description: "El rubro tiene artesanos o solicitudes asociadas." }
  */
  ...controlesAdmin,
  validarRubroId,
  eliminarRubro
);

export default router;
