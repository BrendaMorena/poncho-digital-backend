import {
  sectorSchema,
  actualizarSectorSchema,
  consultarSectoresSchema,
} from "../validators/sectores.schema.js";
import { crearError, detallarErroresZod } from "../utils/errores.js";

export const validarSector = (req, res, next) => {
  const resultado = sectorSchema.safeParse(req.body);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError(
        "Los datos enviados para el sector son inválidos",
        400,
        detalles
      )
    );
  }
  req.body = resultado.data;
  return next();
};

export const validarActualizarSector = (req, res, next) => {
  const resultado = actualizarSectorSchema.safeParse(req.body);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError(
        "Los datos enviados para actualizar el sector son inválidos",
        400,
        detalles
      )
    );
  }
  req.body = resultado.data;
  return next();
};

export const validarConsultaSectores = (req, res, next) => {
  const resultado = consultarSectoresSchema.safeParse(req.query);
  if (!resultado.success) {
    const detalles = detallarErroresZod(resultado.error);
    return next(
      crearError(
        "Los datos enviados para consultar los sectores son inválidos",
        400,
        detalles
      )
    );
  }
  req.consultaSectores = resultado.data;
  return next();
};
