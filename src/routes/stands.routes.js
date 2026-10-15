import express from "express";
import {
  obtenerStands,
  obtenerStandPorId,
  crearStand,
  actualizarStand,
  eliminarStand,
  asignarStand,
  liberarStand,
} from "../controllers/stand.controller.js";
import {
  validarStand,
  validarActualizarStand,
  validarConsultaStands,
  validarAsignarStand,
} from "../middlewares/validation/stands.middleware.js";
import { validarStandId } from "../middlewares/base/validarId.js";
import { capturarBusqueda } from "../middlewares/validation/busquedas.middleware.js";

const router = express.Router();

router.get("/", validarConsultaStands, capturarBusqueda, obtenerStands);
router.get("/:id", validarStandId, obtenerStandPorId);
router.post("/", validarStand, crearStand);
router.post("/asignar", validarAsignarStand, asignarStand);
router.patch("/:id/liberar", validarStandId, liberarStand);
router.patch("/:id", validarStandId, validarActualizarStand, actualizarStand);
router.delete("/:id", validarStandId, eliminarStand);

export default router;

