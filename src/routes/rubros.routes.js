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

router.get("/", obtenerRubros);
router.get("/:id", validarRubroId, obtenerRubroPorId);

// RUTAS PRIVADAS (autenticación -> cuenta -> rol -> validación -> controlador)
router.post("/", ...controlesGestion, validarCreacionRubro, crearRubro);
router.patch("/:id", ...controlesGestion, validarRubroId, validarActualizarRubro, actualizarRubro);
router.delete("/:id", ...controlesAdmin, validarRubroId, eliminarRubro);

export default router;
