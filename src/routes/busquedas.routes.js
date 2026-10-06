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
} from "../middlewares/busquedas.middleware.js";
import { validarBusquedaId } from "../middlewares/validarId.js";

const router = express.Router();

router.get("/", validarConsultaBusqueda, obtenerBusquedas);
router.get("/:id", validarBusquedaId, obtenerBusquedaPorId);
router.post("/", validarBusqueda, crearBusqueda);
router.delete("/:id", validarBusquedaId, eliminarBusqueda);

export default router;