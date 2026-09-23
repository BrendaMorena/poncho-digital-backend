import { crearError, detallarErroresZod } from "../utils/errores.js";

export const validarArtesanos = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body); 
    next();
  } catch (error) {
      return res.status(400).json({
      mensaje: "Errores de validación",
      errores: error.errors.map(err => err.message)
    });
  }
};