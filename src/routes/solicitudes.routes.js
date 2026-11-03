import express from "express";
import {
  crearSolicitud,
  obtenerSolicitudes,
  obtenerSolicitudPorId,
  obtenerMiSolicitud,
  actualizarMiSolicitud,
  cancelarMiSolicitud,
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
} from "../middlewares/validation/solicitudes.middleware.js";
import { validarSolicitudId } from "../middlewares/base/validarId.js";
import { autenticarUsuario } from "../middlewares/auth/autenticacion.middleware.js";
import {
  cargarContextoUsuario,
  soloAdmin,
  organizadoresYAdmins,
  soloArtesano,
} from "../middlewares/auth/autorizacion.middleware.js";

const router = express.Router();

// --- Rutas de recurso propio para ARTESANO ---
router.get("/me", autenticarUsuario, cargarContextoUsuario, soloArtesano, obtenerMiSolicitud);
router.patch("/me", autenticarUsuario, cargarContextoUsuario, soloArtesano, validarActualizacionSolicitud, actualizarMiSolicitud);
router.delete("/me", autenticarUsuario, cargarContextoUsuario, soloArtesano, cancelarMiSolicitud);

// Rutas administrativas (ORGANIZADOR y ADMINISTRADOR)
router.get(
  "/",
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarConsultaSolicitudes,
  obtenerSolicitudes
);

router.get(
  "/:id",
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarSolicitudId,
  obtenerSolicitudPorId
);

router.post(
  "/",
  autenticarUsuario,
  cargarContextoUsuario,
  soloArtesano,
  validarCreacionSolicitud,
  crearSolicitud
);

router.patch(
  "/:id/aprobar",
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarSolicitudId,
  validarAprobacionSolicitud,
  aprobarSolicitud
);

router.patch(
  "/:id/rechazar",
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarSolicitudId,
  validarRechazoSolicitud,
  rechazarSolicitud
);

router.patch(
  "/:id/solicitar-modificacion",
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarSolicitudId,
  validarSolicitudModificacion,
  solicitarModificacion
);

router.patch(
  "/:id",
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarSolicitudId,
  validarActualizacionSolicitud,
  actualizarSolicitud
);

router.delete(
  "/:id",
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarSolicitudId,
  eliminarSolicitud
);

export default router;