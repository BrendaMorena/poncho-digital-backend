import express from "express";
import { obtenerUsuarios, obtenerUsuarioPorId, crearUsuario, actualizarUsuario, eliminarUsuario, registrarArtesano } from "../controllers/usuarios.controller.js";
import { crearUsuarioSchema, actualizarUsuarioSchema, registroArtesanoSchema } from "../validators/usuarios.schemas.js";
import { validarUsuarios, validarConsultaUsuarios } from "../middlewares/usuarios.middleware.js";
import { validarUsuarioId } from "../middlewares/validarId.js";
import { soloAdmin, organizadoresAdmins } from "../middlewares/roles.middleware.js";

const router = express.Router();


router.get("/", organizadoresAdmins,validarConsultaUsuarios, obtenerUsuarios);
router.get("/:id", organizadoresAdmins, validarUsuarioId, obtenerUsuarioPorId);
router.post("/", soloAdmin, validarUsuarios(crearUsuarioSchema), crearUsuario);
router.patch("/:id", validarUsuarioId, validarUsuarios(actualizarUsuarioSchema), actualizarUsuario); //para el futuro cuando ya tengamos login permitir que el uduairo pueda modificar su pass
router.delete("/:id", soloAdmin, validarUsuarioId, eliminarUsuario)
router.post("/artesanos", validarUsuarios(registroArtesanoSchema), registrarArtesano);

export default router;