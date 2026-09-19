import express from 'express'
import { obtenerProductos, obtenerProductoPorId, actualizarProducto, eliminarProducto, crearProducto } from '../controllers/productos.controller.js'
import { validarProductoId } from '../middlewares/validarId.js'

const router = express.Router()

router.get('/', obtenerProductos)
router.get('/:id', validarProductoId, obtenerProductoPorId)
router.post('/', crearProducto)
router.put('/:id',validarProductoId, actualizarProducto)
router.delete('/:id',validarProductoId, eliminarProducto)

export default router
