import * as productoServices from "../services/producto.service.js"
import { crearError } from "../utils/errores.js";

export const crearProducto = async (req, res, next) => {
  try {
    const crearProductoDTO = req.crearProductoDTO;
    const usuarioId = req.contextoUsuario.id_usuario;
    const nuevoProducto = await productoServices.crearProducto(crearProductoDTO, usuarioId);

    return res.status(201).json(nuevoProducto);
  } catch (error) {
    return next(error);
  }
};

export const obtenerProductos = async (req, res, next) => {
  try {
    const criteriosConsulta = req.consultaProductoDTO;
    const productos = await productoServices.consultarProductos(criteriosConsulta);
    return res.json(productos)
  } catch (error) {
    return next(error)
  }
}

export const obtenerMisProductos = async (req, res, next) => {
  try {
    const usuarioId = req.contextoUsuario.id_usuario;
    const productos = await productoServices.obtenerMisProductos(usuarioId);
    return res.status(200).json(productos);
  } catch (error) {
    return next(error);
  }
};

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
    const id = req.productoId;
    const actualizarProductoDTO = req.actualizarProductoDTO;
    const usuarioId = req.contextoUsuario.id_usuario;
    const productoActualizado = await productoServices.actualizarProducto(
      id,
      actualizarProductoDTO,
      usuarioId
    );

    return res.json(productoActualizado);
  } catch (error) {
    return next(error);
  }
};

export const eliminarProducto = async (req, res, next) => {
  try {
    const id = req.productoId;
    const usuarioId = req.contextoUsuario.id_usuario;
    await productoServices.eliminarProducto(id, usuarioId);

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};