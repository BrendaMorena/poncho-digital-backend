import { Prisma } from "../generated/prisma"
import { crearError } from "../utils/errores"

export const verificarEstadoAprobado = async (req, res, next) => {
  try {
  
    const solicitud = await prisma.solicitud.findUnique({
      where: { usuarioId: req.usuarioId }
    });
    if (!solicitud || solicitud.estado_solicitud !== 'APROBADO') {
      return next(crearError("Permiso denegado. Tu solicitud de artesano aún no está APROBADA.", 403));
    }
    next();
    
  } catch (error) {
    next(error);
  }
};