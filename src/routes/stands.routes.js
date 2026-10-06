import express from "express";
import {
  obtenerStands,
  obtenerStandPorId,
  crearStand,
  actualizarStand,
  eliminarStand,
  asignarStand,
  liberarStand,
} from "../controllers/stands.controller.js";
import {
  validarStand,
  validarActualizarStand,
  validarConsultaStands,
  validarAsignarStand,
} from "../middlewares/stands.middleware.js";
import { validarStandId } from "../middlewares/validarId.js";
import { capturarBusqueda } from "../middlewares/busquedas.middleware.js";

const router = express.Router();

router.get("/", validarConsultaStands, capturarBusqueda, obtenerStands);
router.get("/:id", validarStandId, obtenerStandPorId);
router.post("/", validarStand, crearStand);
router.post("/asignar", validarAsignarStand, asignarStand);
router.patch("/:id/liberar", validarStandId, liberarStand);
router.patch("/:id", validarStandId, validarActualizarStand, actualizarStand);
router.delete("/:id", validarStandId, eliminarStand);

export default router;

