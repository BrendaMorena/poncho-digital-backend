import express from "express";
import { obtenerUsuarios, obtenerUsuarioPorId, crearArtesano, actualizarArtesano, eliminarArtesano } from "../controllers/usuarios.controller.js";
import { crearUsuarioSchema, actualizarUsuarioSchema } from "../validators/usuarios.schemas.js";
import { validarUsuarios, validarConsultaUsuarios } from "../middlewares/usuarios.middleware.js";
import { validarUsuarioId } from "../middlewares/validarId.js";
import { soloAdmin, organizadoresAdmins } from "../middlewares/roles.middleware.js";

const router = express.Router();


router.get("/", organizadoresAdmins,validarConsultaUsuarios, obtenerUsuarios);
router.get("/:id", organizadoresAdmins, validarUsuarioId, obtenerUsuarioPorId);
router.post("/", validarUsuarios(crearUsuarioSchema), crearArtesano);
router.patch("/:id", validarUsuarioId, validarUsuarios(actualizarUsuarioSchema), actualizarArtesano);
router.delete("/:id", soloAdmin, validarUsuarioId, eliminarArtesano)



export default router;