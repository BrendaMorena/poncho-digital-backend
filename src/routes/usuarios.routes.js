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
  cambiarActivo,
} from "../controllers/usuario.controller.js";
import {
  validarConsultaUsuarios,
  validarCrearUsuarioAdmin,
  validarActualizarUsuario,
  validarCrearUsuario,
  validarInicioSesion,
  validarActualizarActivo,
} from "../middlewares/validation/usuarios.middleware.js";
import { validarUsuarioId } from "../middlewares/base/validarId.js";
import { autenticarUsuario } from "../middlewares/auth/autenticacion.middleware.js";
import { cerrarSesion } from "../controllers/sesion.controller.js";
import {
  cargarContextoUsuario,
  soloAdmin,
} from "../middlewares/auth/autorizacion.middleware.js";

const router = express.Router();

const controlesAdmin = [autenticarUsuario, cargarContextoUsuario, soloAdmin];

// Rutas especiales y públicas
router.get("/me", autenticarUsuario, cargarContextoUsuario, obtenerMiPerfil);
router.post("/registro", validarCrearUsuario, registrarUsuario); // En el mismo registro se realiza la postulación
router.post("/login", validarInicioSesion, iniciarSesion);
router.post("/logout", autenticarUsuario, cerrarSesion);

// Rutas CRUD (Solo ADMINISTRADOR: autenticación -> cuenta -> rol -> validación -> controlador)
router.get("/", ...controlesAdmin, validarConsultaUsuarios, obtenerUsuarios);
router.get("/:id", ...controlesAdmin, validarUsuarioId, obtenerUsuarioPorId);
router.post("/", ...controlesAdmin, validarCrearUsuarioAdmin, crearUsuario);
router.patch("/:id/activo", ...controlesAdmin, validarUsuarioId, validarActualizarActivo, cambiarActivo);
router.patch("/:id", ...controlesAdmin, validarUsuarioId, validarActualizarUsuario, actualizarUsuario);
router.delete("/:id", ...controlesAdmin, validarUsuarioId, eliminarUsuario);

export default router;
