import express from "express";
import {
  obtenerStands,
  obtenerStandPorId,
  crearStand,
  actualizarStand,
  eliminarStand
} from "../controllers/stands.controller.js";
import { validarStand, validarActualizarStand, validarConsultaStands } from "../middlewares/stands.middleware.js";
import { validarStandId } from "../middlewares/validarId.js";
const router = express.Router();

router.get("/", validarConsultaStands, obtenerStands);
router.get("/:id", validarStandId, obtenerStandPorId);
router.post("/", validarStand, crearStand);
router.patch("/:id", validarStandId, validarActualizarStand, actualizarStand);
router.delete("/:id", validarStandId, eliminarStand);

export default router;
