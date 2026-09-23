import * as productoServices from "../services/producto.services.js"
import { crearError } from "../utils/errores.js";

export const crearProducto = async (req, res, next) => {
  try {
    const crearProductoDTO = req.body;
    const nuevoProducto = await productoServices.crearProducto(crearProductoDTO)

    return res.status(201).json(nuevoProducto);
  } catch (error) {
    if (error.code === "P2003") {
      return next(
        crearError(`El artesano con id ${req.body.artesanoId} no existe en el sistema`, 400)
      );
    }
    return next(error)
  }
}

export const obtenerProductos = async (req, res, next) => {
  try {
    const criteriosConsulta = criteriosConsulta
    const productos = await productoServices.consultarProductos(criteriosConsulta)
    return res.json(productos)
  } catch (error) {
    return next(error)
  }
}

export const obtenerProductoPorId = async (req, res, next) => {
  try {
    const id = req.productoId;
    const producto = await productoServices.obtenerProductoPorId(id)

    if (!producto) {
      return next(crearError(`No existe un producto con id ${req.productoId}`, 404))
    }
    
    return res.json(producto)
  } catch (error) {
    return next(error)
  }
}

export const actualizarProducto = async (req, res, next) => {
  try {
    const id = req.productoId
    const actualizarProductoDTO = req.body
    const productoActualizado = await productoServices.actualizarProducto(id, actualizarProductoDTO)

    return res.json(productoActualizado)
  } catch (error) {
    if (error.code === "P2025") {
      return next(crearError(`No existe un producto con id ${req.productoId}`, 404))
    }
    if (error.code === "P2003") {
      return next(
        crearError(`El artesano con id ${req.body.artesanoId} no existe en el sistema`, 400)
      )
    }
    return next(error)
  }
}

export const eliminarProducto = async (req, res, next) => {
  try {
    const id = req.productoId
    await productoServices.eliminarProducto(id)

    return res.status(204).send()
  } catch (error) {
    if (error.code === "P2025") {
      return next(crearError(`No existe un producto con id ${req.productoId}`, 404))
    }
    return next(error)
  }
}