import express from "express";
import { obtenerUsuarios, obtenerUsuariosPorId, crearArtesano, actualizarArtesano, eliminarArtesano } from "../controllers/artesanos.controller.js";
import { crearArtesanoSchema, actualizarArtesanoSchema } from "../validators/artesanos.schemas.js";
import { validarUsuarios, validarConsultaUsuarios } from "../middlewares/usuarios.middleware.js";
import { validarArtesanoId } from "../middlewares/validarId.js";


const router = express.Router();


router.get("/", validarConsultaUsuarios, obtenerUsuarios);
router.get("/:id", validarUsuarioId, obtenerUsuarioPorId);
router.post("/", validarArtesanos(crearArtesanoSchema), crearArtesano);
router.patch("/:id", validarArtesanoId, validarArtesanos(actualizarArtesanoSchema), actualizarArtesano);
router.delete("/:id", validarArtesanoId, eliminarArtesano)



export default router;