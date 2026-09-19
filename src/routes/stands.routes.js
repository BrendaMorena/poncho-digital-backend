import express from "express";
import {
  obtenerStands,
  obtenerStandsPorId,
  crearStand,
} from "../controllers/stands.controller.js";
import { validarStandId } from "../middlewares/validarId.js";

const router = express.Router();

router.get("/", obtenerStands);
router.get("/:id", validarStandId, obtenerStandsPorId);
router.post("/", crearStand);

export default router;
