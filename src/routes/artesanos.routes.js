import express from "express";
import { obtenerArtesanos, obtenerArtesanoPorId, crearArtesano, actualizarArtesano, eliminarArtesano } from "../controllers/artesanos.controller.js";
import { crearArtesanoSchema, actualizarArtesanoSchema } from "../validators/artesanos.schemas.js";
import { validarArtesanos, validarConsultaArtesanos } from "../middlewares/artesanos.middleware.js";
import { validarArtesanoId } from "../middlewares/validarId.js";


const router = express.Router();


router.get("/", validarConsultaArtesanos, obtenerArtesanos);
router.get("/:id", validarArtesanoId, obtenerArtesanoPorId);
router.post("/", validarArtesanos(crearArtesanoSchema), crearArtesano);
router.patch("/:id", validarArtesanoId, validarArtesanos(actualizarArtesanoSchema), actualizarArtesano);
router.delete("/:id", validarArtesanoId, eliminarArtesano)



export default router;
