import express from "express";
import {
  obtenerSectores,
  obtenerSectorPorId,
  crearSector,
  actualizarSector,
  eliminarSector,
} from "../controllers/sector.controller.js";
import {
  validarSector,
  validarActualizarSector,
  validarConsultaSectores,
} from "../middlewares/validation/sectores.middleware.js";
import { validarSectorId } from "../middlewares/base/validarId.js";
import { autenticarUsuario } from "../middlewares/auth/autenticacion.middleware.js";
import {
  cargarContextoUsuario,
  soloAdmin,
  organizadoresYAdmins,
} from "../middlewares/auth/autorizacion.middleware.js";

const router = express.Router();

const controlesGestion = [autenticarUsuario, cargarContextoUsuario, organizadoresYAdmins];
const controlesAdmin = [autenticarUsuario, cargarContextoUsuario, soloAdmin];

router.get("/", validarConsultaSectores, obtenerSectores);
router.get("/:id", validarSectorId, obtenerSectorPorId);
router.post("/", ...controlesGestion, validarSector, crearSector);
router.patch("/:id", ...controlesGestion, validarSectorId, validarActualizarSector, actualizarSector);
router.delete("/:id", ...controlesAdmin, validarSectorId, eliminarSector);

export default router;
