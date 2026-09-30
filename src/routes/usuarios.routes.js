import express from "express";
import { obtenerUsuarios, obtenerUsuarioPorId, crearArtesano, actualizarArtesano, eliminarArtesano } from "../controllers/usuarios.controller.js";
import { crearUsuarioSchema, actualizarUsuarioSchema } from "../validators/usuarios.schemas.js";
import { validarUsuarios, validarConsultaUsuarios } from "../middlewares/usuarios.middleware.js";
import { validarUsuarioId } from "../middlewares/validarId.js";


const router = express.Router();


router.get("/", validarConsultaUsuarios, obtenerUsuarios);
router.get("/:id", validarUsuarioId, obtenerUsuarioPorId);
router.post("/", validarUsuarios(crearUsuarioSchema), crearArtesano);
router.patch("/:id", validarUsuarioId, validarUsuarios(actualizarUsuarioSchema), actualizarArtesano);
router.delete("/:id", validarUsuarioId, eliminarArtesano)



export default router;