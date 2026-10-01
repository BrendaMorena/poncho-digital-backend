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
} from "../middlewares/pabellones.middleware.js";
import { validarPabellonId } from "../middlewares/validarId.js";

const router = express.Router();

router.get("/", validarConsultaPabellones, obtenerPabellones);
router.get("/:id", validarPabellonId, obtenerPabellonPorId);
router.post("/", validarPabellon, crearPabellon);
router.patch("/:id", validarPabellonId, validarActualizarPabellon, actualizarPabellon);
router.delete("/:id", validarPabellonId, eliminarPabellon);

export default router;
