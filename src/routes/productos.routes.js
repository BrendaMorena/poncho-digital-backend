import express from "express";
import {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto
} from "../controllers/productos.controller.js"
import { validarCreacionProducto,validarActualizarProducto,validarConsultaProducto } from "../middlewares/producto.middleware.js"
import { validarProductoId } from "../middlewares/validarId.js";

const router = express.Router()

router.get("/",validarConsultaProducto, obtenerProductos)
router.get("/:id",validarProductoId, obtenerProductoPorId)
router.post("/", validarCreacionProducto, crearProducto)
router.patch("/:id", validarProductoId, validarActualizarProducto, actualizarProducto)
router.delete("/:id", validarProductoId, eliminarProducto)

export default router;