import express from "express";
import {
  crearLocalidad,
  obtenerLocalidades,
  obtenerLocalidadPorId,
  actualizarLocalidad,
  eliminarLocalidad,
} from "../controllers/localidad.controller.js";
import {
  validarCreacionLocalidad,
  validarActualizacionLocalidad,
  validarConsultaLocalidades,
} from "../middlewares/validation/localidad.middleware.js";
import { validarLocalidadId } from "../middlewares/base/validarId.js";

const router = express.Router();

router.get("/", validarConsultaLocalidades, obtenerLocalidades);
router.get("/:id", validarLocalidadId, obtenerLocalidadPorId);
router.post("/", validarCreacionLocalidad, crearLocalidad);
router.put("/:id", validarLocalidadId, validarActualizacionLocalidad, actualizarLocalidad);
router.patch("/:id", validarLocalidadId, validarActualizacionLocalidad, actualizarLocalidad);
router.delete("/:id", validarLocalidadId, eliminarLocalidad);

export default router;
