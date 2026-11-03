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

router.get("/", validarConsultaPabellones, obtenerPabellones);
router.get("/:id", validarPabellonId, obtenerPabellonPorId);
router.post("/", ...controlesGestion, validarPabellon, crearPabellon);
router.patch("/:id", ...controlesGestion, validarPabellonId, validarActualizarPabellon, actualizarPabellon);
router.delete("/:id", ...controlesAdmin, validarPabellonId, eliminarPabellon);

export default router;
