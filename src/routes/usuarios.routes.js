import express from "express";
import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  registrarUsuario,
  iniciarSesion,
  obtenerMiPerfil,
} from "../controllers/usuario.controller.js";
import {
  validarConsultaUsuarios,
  validarCrearUsuarioAdmin,
  validarActualizarUsuario,
  validarCrearUsuario,
  validarInicioSesion,
} from "../middlewares/validation/usuarios.middleware.js";
import { validarUsuarioId } from "../middlewares/base/validarId.js";
import { autenticarUsuario } from "../middlewares/auth/autenticacion.middleware.js";
import { cerrarSesion } from "../controllers/sesion.controller.js";
// import { soloAdmin, organizadoresAdmins } from "../middlewares/validation/roles.middleware.js";

const router = express.Router();

// Rutas especiales y públicas
router.get("/me", autenticarUsuario, obtenerMiPerfil);
router.post("/registro", validarCrearUsuario, registrarUsuario);
router.post("/login", validarInicioSesion, iniciarSesion);
router.post("/logout", autenticarUsuario, cerrarSesion);

// Rutas CRUD
router.get("/", validarConsultaUsuarios, obtenerUsuarios);
router.get("/:id", validarUsuarioId, obtenerUsuarioPorId);
router.post("/", validarCrearUsuarioAdmin, crearUsuario);
router.patch(
  "/:id",
  validarUsuarioId,
  validarActualizarUsuario,
  actualizarUsuario,
);
router.delete("/:id", validarUsuarioId, eliminarUsuario);

export default router;

// Rutas BRENDA
//router.get("/", organizadoresAdmins,validarConsultaUsuarios, obtenerUsuarios);
//router.get("/:id", organizadoresAdmins, validarUsuarioId, obtenerUsuarioPorId);
//router.post("/", soloAdmin, validarCrearUsuarioAdmin, crearUsuario);
// router.patch("/:id", validarUsuarioId, validarActualizarUsuario, actualizarUsuario); para el futuro cuando ya tengamos login permitir que el uduairo pueda modificar su pass
//router.delete("/:id", soloAdmin, validarUsuarioId, eliminarUsuario)
// router.post("/registro", validarUsuarios(registroArtesanoSchema), registrarArtesano);
