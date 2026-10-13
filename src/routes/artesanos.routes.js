import express from "express";
import { 
  obtenerArtesanos, 
  obtenerArtesanoPorId, 
  crearArtesano, 
  actualizarArtesano, 
  eliminarArtesano 
} from "../controllers/artesano.controller.js";
import { 
  validarCreacionArtesano,
  validarActualizarArtesano, 
  validarConsultaArtesanos 
} from "../middlewares/validation/artesanos.middleware.js";
import { validarArtesanoId } from "../middlewares/base/validarId.js";

const router = express.Router();

router.get("/", validarConsultaArtesanos, obtenerArtesanos);
router.get("/:id", validarArtesanoId, obtenerArtesanoPorId);
router.post("/", validarCreacionArtesano, crearArtesano);

// PATCH y DELETE (Agregar middlewares de autenticación cuando esté el Login)
router.patch("/:id", validarArtesanoId, validarActualizarArtesano, actualizarArtesano);
router.delete("/:id", validarArtesanoId, eliminarArtesano);

export default router;
