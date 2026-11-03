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

router.get("/", validarConsultaLocalidades, obtenerLocalidades);
router.get("/:id", validarLocalidadId, obtenerLocalidadPorId);
router.post("/", ...controlesGestion, validarCreacionLocalidad, crearLocalidad);
router.put("/:id", ...controlesGestion, validarLocalidadId, validarActualizacionLocalidad, actualizarLocalidad);
router.patch("/:id", ...controlesGestion, validarLocalidadId, validarActualizacionLocalidad, actualizarLocalidad);
router.delete("/:id", ...controlesAdmin, validarLocalidadId, eliminarLocalidad);

export default router;
