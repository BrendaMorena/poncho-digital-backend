import { productos } from "../data/productos.js";
import { siguienteId } from '../utils/siguienteId.js';
import { crearError } from '../utils/errores.js';

export const obtenerProductos = (req, res) => {
  res.json(productos);
}

export const obtenerProductoPorId = (req, res, next) => {
      const producto = productos.find(p => p.id === req.productId);

    if (!producto) {
        return next(crearError(`no existe un producto con id ${req.productId}`, 404));
    }

    res.json(producto)
}

export const crearProducto = (req, res) => {
  const { nombre, descripcion, precio, categoria, artesanoId } = req.body;

    if (!nombre || !descripcion || !precio || !categoria || !artesanoId) {
        return next(crearError('Faltan datos obligatorios', 400))
    }

    const nuevoId = siguienteId(productos)

    const nuevoProducto = { id: nuevoId, nombre, descripcion, precio, categoria, artesanoId };

    productos.push(nuevoProducto);
    res.status(201).json(nuevoProducto)
}

export const actualizarProducto = (req, res, next) => {
  const index = productos.findIndex((a) => a.id === req.productId);

  if (index === -1) {
    return next(crearError(`no existe un producto con id ${req.productId}`, 404));
  }

  const { nombre, descripcion, precio, categoria, artesanoId } = req.body;

  if (!nombre && !descripcion && !precio && !categoria && !artesanoId) {
    return next(
      crearError(
        "Tiene que haber al menos un campo obligatorio: nombre y precio son requeridos",
        400,
      ),
    );
  }

  const cambios = {};
  if (nombre) cambios.nombre = nombre;
  if (descripcion) cambios.descripcion = descripcion;
  if (precio) cambios.precio = precio;
  if (categoria) cambios.categoria = categoria;
  if (artesanoId) cambios.artesanoId = artesanoId;

  productos[index] = { ...productos[index], ...cambios };

  res.json(productos[index]);
};

export const eliminarProducto = (req, res, next) => {
  const indice = productos.findIndex(p => p.id === req.productId)

    if (indice === -1) {
        return next(crearError(`no existe un producto con id ${req.productId}`, 404));
    }

    productos.splice(indice, 1);
    res.status(204).send();
}