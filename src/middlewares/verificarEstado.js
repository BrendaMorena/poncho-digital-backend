import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

export const verificarArtesanoAprobado = async (req, res, next) => {
  try {
    const usuarioId = req.usuarioId;

    if (!usuarioId) {
      return next(crearError("No se proporcionó la identificación del usuario", 401));
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: usuarioId },
      include: {
        rol: true,
        solicitud: true,
        artesano: {
          include: { stand: true },
        },
      },
    });

    if (!usuario) {
      return next(crearError(`No existe un usuario con id ${usuarioId}`, 404));
    }

    const nombreRol = usuario.rol?.nombre?.toLowerCase() ?? "";
    if (!nombreRol.includes("artesano")) {
      return next(crearError("Acceso denegado: El usuario no posee el rol de artesano", 403));
    }

    if (!usuario.solicitud || usuario.solicitud.estado_solicitud !== "APROBADO") {
      const estadoActual = usuario.solicitud?.estado_solicitud ?? "SIN_SOLICITUD";
      return next(
        crearError(
          `Acceso denegado: Tu solicitud de artesano aún no está APROBADA (Estado actual: ${estadoActual})`,
          403
        )
      );
    }

    req.usuario = usuario;
    req.artesano = usuario.artesano;
    req.stand = usuario.artesano?.stand;

    next();
  } catch (error) {
    next(error);
  }
};

export const verificarEstadoAprobado = verificarArtesanoAprobado;