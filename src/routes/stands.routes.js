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
import { autenticarUsuario } from "../middlewares/auth/autenticacion.middleware.js";
import {
  cargarContextoUsuario,
  soloAdmin,
  organizadoresYAdmins,
} from "../middlewares/auth/autorizacion.middleware.js";

const router = express.Router();

// Rutas públicas 
router.get("/", validarConsultaStands, capturarBusqueda, obtenerStands);
router.get("/:id", validarStandId, obtenerStandPorId);

// Rutas de gestión de stands (ORGANIZADOR y ADMINISTRADOR)
router.post(
  "/",
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarStand,
  crearStand
);

router.post(
  "/asignar",
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarAsignarStand,
  asignarStand
);

router.patch(
  "/:id/liberar",
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarStandId,
  liberarStand
);

router.patch(
  "/:id",
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarStandId,
  validarActualizarStand,
  actualizarStand
);

router.delete(
  "/:id",
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarStandId,
  eliminarStand
);

export default router;
