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

const router = express.Router();

router.get("/", validarConsultaBusqueda, obtenerBusquedas);
router.get("/:id", validarBusquedaId, obtenerBusquedaPorId);
router.post("/", validarBusqueda, crearBusqueda);
router.delete("/:id", validarBusquedaId, eliminarBusqueda);

export default router;