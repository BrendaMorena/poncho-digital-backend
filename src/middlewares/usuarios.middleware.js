import prisma from "../config/prisma.js";
import { iniciarSesion } from "../controllers/usuario.controller.js";
import { crearError, detallarErroresZod } from "../utils/errores.js";
import { consultarUsuarioSchema, crearUsuarioSchema, iniciarSesionSchema } from "../validators/usuarios.schema.js";

export const validarUsuarios = (schema) => (req, res, next) =>{
  const resultado = schema.safeParse(req.body);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError(
        "Los datos enviados para el usuario son inválidos",
        400,
        detalles
      )
    );
  }
  req.body = resultado.data;
  return next();
}

export const validarConsultaUsuarios = (req, res, next) => {
  const resultado = consultarUsuarioSchema.safeParse(req.query);  
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError(
        "los datos enviados para consultar el usuario son inválidos",
        400,
        detalles,
      ),
    );
  }
  req.consultaUsuarios = resultado.data;
  return next();
}



export const validarCrearUsuario = (req, res, next) => {
  const resultado = crearUsuarioSchema.safeParse(
    req.body
  );
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError(
        "Los datos enviados para el inicio de sesión son inválidos",
        400,
        detalles
      )
    );
  }
  req.iniciarSesionDTO = resultado.data;
  return next();
};



export const validarInicioSesion = (req, res, next) => {
const resultado = iniciarSesionSchema.safeParse(
  req.body
);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError(
        "Los datos enviados para el usuario son inválidos",
        400,
        detalles
      )
    );
  }
req.crearUsuarioDto = resultado.data;
return next();
};