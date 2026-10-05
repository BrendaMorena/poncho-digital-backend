import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";


const verificarUsuarioArtesano = async (usuarioId, tx = prisma) => {
  const usuario = await tx.usuario.findUnique({
    where: { id_usuario: usuarioId },
    include: {
      rol: true,
      solicitud: true,
      artesano: true,
    },
  });

  if (!usuario) {
    throw crearError(`No existe un usuario con id ${usuarioId}`, 404);
  }

  const nombreRol = usuario.rol?.nombre?.toLowerCase() ?? "";
  if (nombreRol && !nombreRol.includes("artesano")) {
    throw crearError(
      `El usuario con id ${usuarioId} no posee el rol de artesano (rol actual: ${usuario.rol?.nombre})`,
      403
    );
  }

  if (usuario.solicitud) {
    throw crearError(
      `El usuario ya cuenta con una solicitud registrada (Estado: ${usuario.solicitud.estado_solicitud})`,
      409
    );
  }

  if (usuario.artesano) {
    throw crearError(
      `El usuario ya se encuentra registrado como artesano activo con id ${usuario.artesano.id_artesano}`,
      409
    );
  }
};

const verificarRubro = async (rubroId, tx = prisma) => {
  const rubro = await tx.rubro.findUnique({
    where: { id_rubro: rubroId },
  });

  if (!rubro) {
    throw crearError(`No existe un rubro con id ${rubroId}`, 404);
  }
};

export const crearSolicitud = async (crearSolicitudDTO, tx = prisma) => {
  const { descripcion_emprendimiento, usuarioId, rubroId } = crearSolicitudDTO;

  await verificarUsuarioArtesano(usuarioId, tx);
  await verificarRubro(rubroId, tx);

  return tx.solicitud.create({
    data: {
      descripcion_emprendimiento,
      usuarioId,
      rubroId,
      estado_solicitud: "PENDIENTE",
    },
    include: {
      usuario: {
        select: {
          id_usuario: true,
          nombre: true,
          apellido: true,
          email: true,
          telefono: true,
          rol: {
            select: {
              id_rol: true,
              nombre: true,
            },
          },
        },
      },
      rubro: true,
    },
  });
};

export const consultarSolicitudes = async (criteriosConsulta) => {
  const {
    estado_solicitud,
    usuarioId,
    rubroId,
    ordenPor,
    direccion,
    pagina,
    limite,
  } = criteriosConsulta;

  const where = {};

  if (estado_solicitud !== undefined) {
    where.estado_solicitud = estado_solicitud;
  }

  if (usuarioId !== undefined) {
    where.usuarioId = usuarioId;
  }

  if (rubroId !== undefined) {
    where.rubroId = rubroId;
  }

  const desplazamiento = (pagina - 1) * limite;

  const [solicitudes, total] = await prisma.$transaction([
    prisma.solicitud.findMany({
      where,
      orderBy: [
        { [ordenPor]: direccion },
        { id_solicitud: "asc" },
      ],
      skip: desplazamiento,
      take: limite,
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
            rol: {
              select: {
                id_rol: true,
                nombre: true,
              },
            },
          },
        },
        rubro: true,
      },
    }),
    prisma.solicitud.count({ where }),
  ]);

  return {
    solicitudes,
    paginacion: {
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite),
    },
  };
};

export const obtenerSolicitudPorId = async (id) => {
  return prisma.solicitud.findUnique({
    where: { id_solicitud: id },
    include: {
      usuario: {
        select: {
          id_usuario: true,
          nombre: true,
          apellido: true,
          email: true,
          telefono: true,
          rol: {
            select: {
              id_rol: true,
              nombre: true,
            },
          },
        },
      },
      rubro: true,
    },
  });
};

export const aprobarSolicitud = async (id, datosAprobacion = {}) => {
  const { observaciones_admin, standId } = datosAprobacion;

  const solicitud = await prisma.solicitud.findUnique({
    where: { id_solicitud: id },
    include: {
      rubro: true,
    },
  });

  if (!solicitud) {
    throw crearError(`No existe una solicitud con id ${id}`, 404);
  }

  if (solicitud.estado_solicitud !== "PENDIENTE") {
    throw crearError(
      `Solo se pueden aprobar solicitudes en estado PENDIENTE (estado actual: ${solicitud.estado_solicitud})`,
      400
    );
  }

  const artesanoExistente = await prisma.artesano.findUnique({
    where: { usuarioId: solicitud.usuarioId },
  });

  if (artesanoExistente) {
    throw crearError("El usuario de esta solicitud ya está registrado como artesano", 409);
  }

  return prisma.$transaction(async (tx) => {
    let standElegido;

    if (standId) {
      standElegido = await tx.stand.findFirst({
        where: {
          id_stand: standId,
          estado: "DISPONIBLE",
          artesanoId: null,
        },
        include: {
          sector: {
            include: { pabellon: true },
          },
        }
      });

      if (!standElegido) {
        throw crearError(
          `El stand con id ${standId} no existe o no se encuentra disponible`,
          409
        );
      }
    } else {
      standElegido = await tx.stand.findFirst({
        where: {
          estado: "DISPONIBLE",
          artesanoId: null,
          sector: {
            rubroId: solicitud.rubroId,
        },
        },
        orderBy: {
          id_stand: "asc",
        },
        include: {
          sector: {
            include: { pabellon: true },
          },
        }
      });

      if (!standElegido) {
        throw crearError(
          "No hay stands disponibles en el predio para asignar automáticamente. El organizador debe indicar manualmente un 'standId' alternativo o liberar cupos.",
          409
        );
      }
    }

    const solicitudActualizada = await tx.solicitud.update({
      where: { id_solicitud: id },
      data: {
        estado_solicitud: "APROBADO",
        observaciones_admin: observaciones_admin ?? solicitud.observaciones_admin ?? "Solicitud aprobada",
      },
      include: {
        rubro: true,
      },
    });

    const nuevoArtesano = await tx.artesano.create({
      data: {
        descripcion: solicitud.descripcion_emprendimiento,
        usuarioId: solicitud.usuarioId,
        rubroId: solicitud.rubroId,
      },
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
          },
        },
        rubro: true,
      },
    });

    const standAsignado = await tx.stand.update({
      where: { id_stand: standElegido.id_stand },
      data: {
        artesanoId: nuevoArtesano.id_artesano,
        estado: "OCUPADO",
      },
      include: {
        sector: {
          include: { pabellon: true },
        },
      }
    });

    return {
      mensaje: standId
        ? "Solicitud aprobada con asignación manual de stand"
        : "Solicitud aprobada con asignación automática de stand",
      solicitud: solicitudActualizada,
      artesano: nuevoArtesano,
      standAsignado,
    };
  });
};

export const rechazarSolicitud = async (id, { observaciones_admin }) => {
  const solicitud = await prisma.solicitud.findUnique({
    where: { id_solicitud: id },
  });

  if (!solicitud) {
    throw crearError(`No existe una solicitud con id ${id}`, 404);
  }

  if (solicitud.estado_solicitud !== "PENDIENTE") {
    throw crearError(
      `Solo se pueden rechazar solicitudes en estado PENDIENTE (estado actual: ${solicitud.estado_solicitud})`,
      400
    );
  }

  const solicitudActualizada = await prisma.solicitud.update({
    where: { id_solicitud: id },
    data: {
      estado_solicitud: "RECHAZADO",
      observaciones_admin,
    },
    include: {
      usuario: {
        select: {
          id_usuario: true,
          nombre: true,
          apellido: true,
          email: true,
        },
      },
      rubro: true,
    },
  });

  return {
    mensaje: "Solicitud rechazada correctamente",
    solicitud: solicitudActualizada,
  };
};

export const solicitarModificacion = async (id, { observaciones_admin }) => {
  const solicitud = await prisma.solicitud.findUnique({
    where: { id_solicitud: id },
  });

  if (!solicitud) {
    throw crearError(`No existe una solicitud con id ${id}`, 404);
  }

  if (solicitud.estado_solicitud !== "PENDIENTE") {
    throw crearError(
      `Solo se pueden solicitar modificaciones a solicitudes en estado PENDIENTE (estado actual: ${solicitud.estado_solicitud})`,
      400
    );
  }

  const solicitudActualizada = await prisma.solicitud.update({
    where: { id_solicitud: id },
    data: {
      estado_solicitud: "MODIFICACION_SOLICITADA",
      observaciones_admin,
    },
    include: {
      usuario: {
        select: {
          id_usuario: true,
          nombre: true,
          apellido: true,
          email: true,
        },
      },
      rubro: true,
    },
  });

  return {
    mensaje: "Se ha solicitado una modificación al artesano",
    solicitud: solicitudActualizada,
  };
};

export const actualizarSolicitud = async (id, actualizarSolicitudDTO) => {
  const solicitud = await prisma.solicitud.findUnique({
    where: { id_solicitud: id },
  });

  if (!solicitud) {
    throw crearError(`No existe una solicitud con id ${id}`, 404);
  }

  if (solicitud.estado_solicitud === "APROBADO") {
    throw crearError("No se pueden modificar los datos de una solicitud que ya fue aprobada", 400);
  }

  if (actualizarSolicitudDTO.rubroId) {
    await verificarRubro(actualizarSolicitudDTO.rubroId);
  }

  const dataAActualizar = {
    ...actualizarSolicitudDTO,
    estado_solicitud: "PENDIENTE", 
  };

  const solicitudActualizada = await prisma.solicitud.update({
    where: { id_solicitud: id },
    data: dataAActualizar,
    include: {
      usuario: {
        select: {
          id_usuario: true,
          nombre: true,
          apellido: true,
          email: true,
          telefono: true,
        },
      },
      rubro: true,
    },
  });

  return {
    mensaje: "Solicitud actualizada con éxito; ha vuelto a estado PENDIENTE para revisión de los organizadores",
    solicitud: solicitudActualizada,
  };
};

export const eliminarSolicitud = async (id) => {
  const solicitud = await prisma.solicitud.findUnique({
    where: { id_solicitud: id },
  });

  if (!solicitud) {
    throw crearError(`No existe una solicitud con id ${id}`, 404);
  }

  if (solicitud.estado_solicitud === "APROBADO") {
    throw crearError(
      "No se puede eliminar una solicitud aprobada porque ya tiene un artesano y stand asignados",
      400
    );
  }

  return prisma.solicitud.delete({
    where: { id_solicitud: id },
  });
};