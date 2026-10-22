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
  soloArtesano,
} from "../middlewares/auth/autorizacion.middleware.js";

const router = express.Router();

// Rutas públicas (catálogo de productos) 
router.get("/", validarConsultaProducto, obtenerProductos);

// --- Rutas de recurso propio para ARTESANO ---
router.get("/me", autenticarUsuario, cargarContextoUsuario, soloArtesano, obtenerMisProductos);

router.get("/:id", validarProductoId, obtenerProductoPorId);

// Rutas protegidas para ARTESANO 
router.post(
  "/",
  autenticarUsuario,
  cargarContextoUsuario,
  soloArtesano,
  validarCreacionProducto,
  crearProducto
);

router.patch(
  "/:id",
  autenticarUsuario,
  cargarContextoUsuario,
  soloArtesano,
  validarProductoId,
  validarActualizarProducto,
  actualizarProducto
);

router.delete(
  "/:id",
  autenticarUsuario,
  cargarContextoUsuario,
  soloArtesano,
  validarProductoId,
  eliminarProducto
);

export default router;