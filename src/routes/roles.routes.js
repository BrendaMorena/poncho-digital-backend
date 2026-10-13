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

const router = express.Router();

router.get("/", validarConsultaRoles, obtenerRoles);
router.get("/:id", validarRolId, obtenerRolPorId);
router.post("/", validarRol, crearRol);
router.patch("/:id", validarRolId, validarActualizarRol, actualizarRol);
router.delete("/:id", validarRolId, eliminarRol);

export default router;
