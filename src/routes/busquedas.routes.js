import express from "express";
import {
  obtenerBusquedas,
  obtenerBusquedaPorId,
  crearBusqueda,
  eliminarBusqueda,
} from "../controllers/busqueda.controller.js";
import {
  validarBusqueda,
  validarConsultaBusqueda,
} from "../middlewares/validation/busquedas.middleware.js";
import { validarBusquedaId } from "../middlewares/base/validarId.js";
import { autenticarUsuario } from "../middlewares/auth/autenticacion.middleware.js";
import {
  cargarContextoUsuario,
  soloAdmin,
  organizadoresYAdmins,
} from "../middlewares/auth/autorizacion.middleware.js";

const router = express.Router();

const controlesGestion = [autenticarUsuario, cargarContextoUsuario, organizadoresYAdmins];
const controlesAdmin = [autenticarUsuario, cargarContextoUsuario, soloAdmin];

router.get("/", ...controlesGestion, validarConsultaBusqueda, obtenerBusquedas);
router.get("/:id", ...controlesGestion, validarBusquedaId, obtenerBusquedaPorId);
router.post("/", validarBusqueda, crearBusqueda);
router.delete("/:id", ...controlesAdmin, validarBusquedaId, eliminarBusqueda);

export default router;
