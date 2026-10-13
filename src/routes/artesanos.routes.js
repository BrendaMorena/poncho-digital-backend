import express from "express";
import { obtenerArtesanos, obtenerArtesanoPorId, actualizarArtesano, eliminarArtesano } from "../controllers/artesano.controller.js";
import { actualizarArtesanoSchema } from "../validators/artesanos.schema.js";
import { validarArtesanos, validarConsultaArtesanos } from "../middlewares/validation/artesanos.middleware.js";
import { validarArtesanoId } from "../middlewares/base/validarId.js";

const router = express.Router();

router.get("/", validarConsultaArtesanos, obtenerArtesanos);
router.get("/:id", validarArtesanoId, obtenerArtesanoPorId);

// PATCH y DELETE (Agregar middlewares de autenticación cuando esté el Login)
router.patch("/:id", validarArtesanoId, validarArtesanos(actualizarArtesanoSchema), actualizarArtesano);
router.delete("/:id", validarArtesanoId, eliminarArtesano);

export default router;
