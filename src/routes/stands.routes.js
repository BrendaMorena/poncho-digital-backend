import express from "express";
import {
  obtenerStands,
  obtenerStandsPorId,
  crearStand,
} from "../controllers/stands.controller.js";
import { validarCreacionSchema } from "../middlewares/stands.middleware.js";

const router = express.Router();

router.get("/", obtenerStands);
router.get("/:id", obtenerStandsPorId);
router.post("/", validarCreacionSchema, crearStand);

export default router;
