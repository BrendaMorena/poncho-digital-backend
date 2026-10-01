import express from "express";
import {
  crearSolicitud,
  obtenerSolicitudes,
  obtenerSolicitudPorId,
  aprobarSolicitud,
  actualizarSolicitud,
  eliminarSolicitud,
} from "../controllers/solicitud.controller.js";
import {
  validarCreacionSolicitud,
  validarAprobacionSolicitud,
  validarActualizacionSolicitud,
  validarConsultaSolicitudes,
} from "../middlewares/solicitud.middleware.js";
import { validarSolicitudId } from "../middlewares/validarId.js";

const router = express.Router()

router.get("/", validarConsultaSolicitudes, obtenerSolicitudes)
router.get("/:id", validarSolicitudId, obtenerSolicitudPorId)
router.post("/", validarCreacionSolicitud, crearSolicitud)
router.patch("/:id/aprobar", validarSolicitudId, validarAprobacionSolicitud, aprobarSolicitud)
router.put("/:id", validarSolicitudId, validarActualizacionSolicitud, actualizarSolicitud)
router.delete("/:id", validarSolicitudId, eliminarSolicitud)

export default router