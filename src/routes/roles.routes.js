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
} from "../middlewares/roles.middleware.js";
import { validarRolId } from "../middlewares/validarId.js";

const router = express.Router();

router.get("/", validarConsultaRoles, obtenerRoles);
router.get("/:id", validarRolId, obtenerRolPorId);
router.post("/", validarRol, crearRol);
router.patch("/:id", validarRolId, validarActualizarRol, actualizarRol);
router.delete("/:id", validarRolId, eliminarRol);

export default router;
