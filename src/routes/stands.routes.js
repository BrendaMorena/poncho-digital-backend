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
import { capturarBusqueda } from "../middlewares/busquedas.middleware.js";

const router = express.Router();

router.get("/", validarConsultaStands, capturarBusqueda, obtenerStands);
router.get("/:id", validarStandId, obtenerStandPorId);
router.post("/", validarStand, crearStand);
router.patch("/:id", validarStandId, validarActualizarStand, actualizarStand);
router.delete("/:id", validarStandId, eliminarStand);

export default router;
