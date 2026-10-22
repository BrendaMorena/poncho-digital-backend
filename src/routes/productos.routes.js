import express from "express";
import {
  crearProducto,
  obtenerProductos,
  obtenerMisProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
} from "../controllers/productos.controller.js";
import {
  validarCreacionProducto,
  validarActualizarProducto,
  validarConsultaProducto,
} from "../middlewares/validation/producto.middleware.js";
import { validarProductoId } from "../middlewares/base/validarId.js";
import { autenticarUsuario } from "../middlewares/auth/autenticacion.middleware.js";
import {
  cargarContextoUsuario,
  soloArtesanoHabilitado,
} from "../middlewares/auth/autorizacion.middleware.js";

const router = express.Router();

// Rutas públicas (GET /me va ANTES de GET /:id para que Express no tome "me" como :id)
router.get("/", validarConsultaProducto, obtenerProductos);

// --- Rutas de recurso propio para ARTESANO HABILITADO ---
router.get(
  "/me",
  autenticarUsuario,
  cargarContextoUsuario,
  soloArtesanoHabilitado,
  obtenerMisProductos
);

router.get("/:id", validarProductoId, obtenerProductoPorId);

// Rutas protegidas para ARTESANO HABILITADO
router.post(
  "/",
  autenticarUsuario,
  cargarContextoUsuario,
  soloArtesanoHabilitado,
  validarCreacionProducto,
  crearProducto
);

router.patch(
  "/:id",
  autenticarUsuario,
  cargarContextoUsuario,
  soloArtesanoHabilitado,
  validarProductoId,
  validarActualizarProducto,
  actualizarProducto
);

router.delete(
  "/:id",
  autenticarUsuario,
  cargarContextoUsuario,
  soloArtesanoHabilitado,
  validarProductoId,
  eliminarProducto
);

export default router;
