import {crearError} from "../utils/errores.js";
import * as usuarioService from "../services/usuario.service.js";

export const obtenerUsuarios = async (req, res, next) => {
  try{
    const { pagina, limite, ordenarPor, direccion } = req.consultaUsuarios;
    const usuarios = await usuarioService.obtenerUsuarios(pagina, limite, ordenarPor, direccion);
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


export const registrarArtesano = async (req, res, next) => {
  try {
    const datosRegistro = req.body;
    
    // Llama al servicio de solicitud 
    const resultado = await usuarioService.registrarArtesano(datosRegistro);
    
    return res.status(201).json({
      mensaje: "Postulación a artesano enviada con éxito. Ya puedes iniciar sesión.",
      datos: resultado
    });
  } catch (error) {
    return next(error);
  }
};

//crear admin
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
    return res.status(200).json({ mensaje: "Usuario eliminado exitosamente" });
    } catch (error) {
    return next(error);
  }
}
