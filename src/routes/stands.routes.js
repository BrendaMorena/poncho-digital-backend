import express from "express";
import {
  obtenerStands,
  obtenerStandsPorId,
  crearStand,
  actualizarStand,
  eliminarStand
} from "../controllers/stands.controller.js";
import { validarStand, validarActualizarStand } from "../middlewares/stands.middleware.js";
import { validarStandId } from "../middlewares/validarId.js";
const router = express.Router();

router.get("/", obtenerStands);
router.get("/:id", validarStandId, obtenerStandsPorId);
router.post("/", validarStand, crearStand);
router.patch("/:id", validarStandId, validarActualizarStand, actualizarStand);
router.delete("/:id", validarStandId, eliminarStand);

export default router;
