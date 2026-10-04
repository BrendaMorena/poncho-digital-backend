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
} from "../middlewares/sectores.middleware.js";
import { validarSectorId } from "../middlewares/validarId.js";

const router = express.Router();

router.get("/", validarConsultaSectores, obtenerSectores);
router.get("/:id", validarSectorId, obtenerSectorPorId);
router.post("/", validarSector, crearSector);
router.patch("/:id", validarSectorId, validarActualizarSector, actualizarSector);
router.delete("/:id", validarSectorId, eliminarSector);

export default router;
