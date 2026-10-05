import express from "express";
import {
  crearSolicitud,
  obtenerSolicitudes,
  obtenerSolicitudPorId,
  aprobarSolicitud,
  rechazarSolicitud,
  solicitarModificacion,
  actualizarSolicitud,
  eliminarSolicitud,
} from "../controllers/solicitud.controller.js";
import {
  validarCreacionSolicitud,
  validarAprobacionSolicitud,
  validarRechazoSolicitud,
  validarSolicitudModificacion,
  validarActualizacionSolicitud,
  validarConsultaSolicitudes,
} from "../middlewares/solicitudes.middleware.js";
import { validarSolicitudId } from "../middlewares/validarId.js";

const router = express.Router();

router.get("/", validarConsultaSolicitudes, obtenerSolicitudes);
router.get("/:id", validarSolicitudId, obtenerSolicitudPorId);
router.post("/", validarCreacionSolicitud, crearSolicitud);
router.patch("/:id/aprobar", validarSolicitudId, validarAprobacionSolicitud, aprobarSolicitud);
router.patch("/:id/rechazar", validarSolicitudId, validarRechazoSolicitud, rechazarSolicitud);
router.patch("/:id/solicitar-modificacion",validarSolicitudId,validarSolicitudModificacion,solicitarModificacion);
router.put("/:id", validarSolicitudId, validarActualizacionSolicitud, actualizarSolicitud);
router.delete("/:id", validarSolicitudId, eliminarSolicitud);

export default router;