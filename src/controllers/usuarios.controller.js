import {crearError} from "../utils/error.js";
import * as usuarioService from "../services/usuario.service.js";

export const obtenerUsuarios = async (req, res, next) => {
  try{
    const { page, limit, sortBy, sortOrder } = req.consultaUsuarios;
    const usuarios = await usuarioService.obtenerUsuarios(page, limit, sortBy, sortOrder);
    return res.status(200).json(usuarios);
  }catch (error) {
    next(error);
  }
};

export const obtenerUsuarioPorId = async (req, res, next) => {
  try{
    const idUsuario = req.usuarioId;
    const usuario = await usuarioService.obtenerUsuarioPorId(idUsuario);
    if (!usuario) {
      return next(crearError("El usuario no existe.", 404));
    }
    return res.json(usuario);
  } catch (error) {
    next(error);  
  }
};

export const crearUsuario = async (req, res, next) => {
  try{
    const crearUsuarioDTO = req.body;
    const nuevoUsuario = await usuarioService.crearUsuario(crearUsuarioDTO);
  return res.status(201).json(nuevoUsuario);
  }catch (error) {
    if (error.code === "P2002") {
      return next(crearError(`El usuario ya existe en el sistema`, 409)); 
    }
  return next(error);
  }
};

export const actualizarUsuario = async (req, res, next) => {
  try {
    const idUsuario = req.usuarioId;
    const actualizarUsuarioDTO = req.body;
    const usuarioActualizado = await usuarioService.actualizarUsuario(idUsuario, actualizarUsuarioDTO);
    return res.json(usuarioActualizado);
  } catch (error) {
    return next(error);
  }
};

export const eliminarUsuario = async (req, res, next) => {
  try {
    const idUsuario = req.usuarioId;
    await usuarioService.eliminarUsuario(idUsuario);
    return res.status(204).send(); 
  } catch (error) {
    return next(error);
  }
}
