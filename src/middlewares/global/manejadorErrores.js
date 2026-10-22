export const manejadorErrores = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  const mensajesPrisma = {
    P2002: "Ya existe un registro con esos datos únicos.",
    P2003: "La operación afecta registros relacionados.",
    P2025: "Registro no encontrado.",
    P2034: "Hubo otro cambio simultáneo. Reintentar.",
  };

  const mensajeErrorPrisma = mensajesPrisma[err.code];
  const status = mensajeErrorPrisma
    ? err.code === "P2025"
      ? 404
      : 409
    : err.status || 500;

  if (status >= 500) {
    console.error(err);
    return res.status(status).json({
      error: "Error interno del servidor.",
      mensaje: "Error interno del servidor.",
    });
  }

  const mensaje = mensajeErrorPrisma || err.message;

  if (err.detalles) {
    return res.status(status).json({
      error: mensaje,
      mensaje,
      detalles: err.detalles,
    });
  }

  return res.status(status).json({
    error: mensaje,
    mensaje,
  });
};
