import { crearError } from "../utils/errores.js";
import * as usuarioService from "../services/usuario.service.js";
import { generarToken } from "../services/token.service.js";

export const obtenerUsuarios = async (req, res, next) => {
  try {
    const criteriosConsulta = req.consultaUsuariosDTO;
    const usuarios = await usuarioService.obtenerUsuarios(criteriosConsulta);
    return res.json(usuarios);
  } catch (error) {
    next(error);
  }
};

export const obtenerUsuarioPorId = async (req, res, next) => {
  try {
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

    const resultado = await usuarioService.registrarArtesano(datosRegistro);

    return res.status(201).json({
      mensaje:
        "Postulación a artesano enviada con éxito. Ya puedes iniciar sesión.",
      datos: resultado,
    });
  } catch (error) {
    return next(error);
  }
};

//crear admin
export const crearUsuario = async (req, res, next) => {
  try {
    const crearUsuarioDTO = req.crearUsuarioDTO;
    const nuevoUsuario = await usuarioService.crearUsuario(crearUsuarioDTO);
    return res.status(201).json(nuevoUsuario);
  } catch (error) {
    if (error.code === "P2002") {
      return next(crearError(`El usuario ya existe en el sistema`, 409));
    }
    return next(error);
  }
};

export const actualizarUsuario = async (req, res, next) => {
  try {
    const idUsuario = req.usuarioId;
    const actualizarUsuarioDTO = req.actualizarUsuarioDTO;
    const usuarioActualizado = await usuarioService.actualizarUsuario(
      idUsuario,
      actualizarUsuarioDTO,
    );
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
};

export const registrarUsuario = async (req, res, next) => {
  try {
    const registrarUsuarioDTO = req.registroUsuarioDTO;
    const usuario = await usuarioService.registrarUsuario(registrarUsuarioDTO);
    return res.status(201).json(usuario);
  } catch (error) {
    return next(error);
  }
};

export const iniciarSesion = async (req, res, next) => {
  try {
    const usuario = await usuarioService.iniciarSesion(req.iniciarSesionDTO);
    const token = generarToken(usuario);

    return res.status(200).json({
      mensaje: "Credenciales verificadas correctamente.",
      token: token,
      usuario: usuario,
    });
  } catch (error) {
    return next(error);
  }
};

export const obtenerMiPerfil = async (req, res, next) => {
  try {
    const idUsuario = req.usuario.id;
    const usuario = await usuarioService.obtenerUsuarioPorId(idUsuario);
    if (!usuario) {
      res.set("WWW-Authenticate", 'Bearer error="invalid_token"');
      return res.status(401).json({
        mensaje: "La cuenta asociada al token no existe.",
      });
    }
    return res.status(200).json({ usuario: usuario });
  } catch (error) {
    return next(error);
  }
};
