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

router.get("/", ...controlesAdmin, validarConsultaRoles, obtenerRoles);
router.get("/:id", ...controlesAdmin, validarRolId, obtenerRolPorId);
router.post("/", ...controlesAdmin, validarRol, crearRol);
router.patch("/:id", ...controlesAdmin, validarRolId, validarActualizarRol, actualizarRol);
router.delete("/:id", ...controlesAdmin, validarRolId, eliminarRol);

export default router;
