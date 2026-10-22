import express from "express";
import {
  obtenerArtesanos,
  obtenerArtesanoPorId,
  obtenerMiArtesano,
  actualizarMiArtesano,
  crearArtesano,
  actualizarArtesano,
  eliminarArtesano,
} from "../controllers/artesano.controller.js";
import {
  validarCreacionArtesano,
  validarActualizarArtesano,
  validarConsultaArtesanos,
} from "../middlewares/validation/artesanos.middleware.js";
import { validarArtesanoId } from "../middlewares/base/validarId.js";
import { autenticarUsuario } from "../middlewares/auth/autenticacion.middleware.js";
import {
  cargarContextoUsuario,
  soloAdmin,
  organizadoresYAdmins,
  soloArtesano,
} from "../middlewares/auth/autorizacion.middleware.js";

const router = express.Router();

// Rutas públicas 
router.get("/", validarConsultaArtesanos, obtenerArtesanos);

// --- Rutas de recurso propio para ARTESANO ---
router.get("/me", autenticarUsuario, cargarContextoUsuario, soloArtesano, obtenerMiArtesano);
router.patch("/me", autenticarUsuario, cargarContextoUsuario, soloArtesano, validarActualizarArtesano, actualizarMiArtesano);

router.get("/:id", validarArtesanoId, obtenerArtesanoPorId);

// Rutas administrativas (ORGANIZADOR y ADMINISTRADOR) 
router.post(
  "/",
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarCreacionArtesano,
  crearArtesano
);

router.patch(
  "/:id",
  autenticarUsuario,
  cargarContextoUsuario,
  organizadoresYAdmins,
  validarArtesanoId,
  validarActualizarArtesano,
  actualizarArtesano
);

router.delete(
  "/:id",
  autenticarUsuario,
  cargarContextoUsuario,
  soloAdmin,
  validarArtesanoId,
  eliminarArtesano
);

export default router;
