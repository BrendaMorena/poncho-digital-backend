import express from "express";
import { obtenerArtesanos, obtenerArtesanoPorId, actualizarArtesano, eliminarArtesano } from "../controllers/artesano.controller.js";
import { actualizarArtesanoSchema } from "../validators/artesanos.schema.js";
import { validarArtesanos, validarConsultaArtesanos } from "../middlewares/artesanos.middleware.js";
import { validarArtesanoId } from "../middlewares/validarId.js";

const router = express.Router();

router.get("/", validarConsultaArtesanos, obtenerArtesanos);
router.get("/:id", validarArtesanoId, obtenerArtesanoPorId);

// PATCH y DELETE (Agregar middlewares de autenticación cuando esté el Login)
router.patch("/:id", validarArtesanoId, validarArtesanos(actualizarArtesanoSchema), actualizarArtesano);
router.delete("/:id", validarArtesanoId, eliminarArtesano);

export default router;
