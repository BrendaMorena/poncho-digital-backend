import { prisma } from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

const verificarUsuario = async (usuarioId) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: usuarioId },
  })

  if (!usuario) {
    throw crearError(`No existe un usuario con id ${usuarioId}`, 400)
  }
}

const verificarRubro = async (rubroId) => {
  const rubro = await prisma.rubro.findUnique({
    where: { id_rubro: rubroId },
  })

  if (!rubro) {
    throw crearError(`No existe un rubro con id ${rubroId}`, 400);
  }
}

export const crearSolicitud = async (crearSolicitudDTO) => {
  const { descripcion_emprendimiento, usuarioId, rubroId } = crearSolicitudDTO

  if (usuarioId) {
    await verificarUsuario(usuarioId)
  }

  if (rubroId) {
    await verificarRubro(rubroId)
  }

  return prisma.solicitud.create({
    data: {
      descripcion_emprendimiento,
      usuarioId,
      rubroId,
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
  })
}

export const consultarSolicitudes = async (criteriosConsulta) => {
  const {
    estado_solicitud,
    usuarioId,
    rubroId,
    ordenPor,
    direccion,
    pagina,
    limite,
  } = criteriosConsulta

  const where = {};

  if (estado_solicitud !== undefined) {
    where.estado_solicitud = estado_solicitud
  }

  if (usuarioId !== undefined) {
    where.usuarioId = usuarioId
  }

  if (rubroId !== undefined) {
    where.rubroId = rubroId
  }

  const desplazamiento = (pagina - 1) * limite

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
        },
      },
      rubro: true,
    },
  })
}

export const aprobarSolicitud = async (id, aprobarSolicitudDTO) => {
  const { observaciones_admin } = aprobarSolicitudDTO

  const solicitud = await prisma.solicitud.findUnique({
    where: { id_solicitud: id },
  })

  if (!solicitud) {
    throw crearError(`No existe una solicitud con id ${id}`, 404)
  }

  if (solicitud.estado_solicitud === "APROBADO") {
    throw crearError("La solicitud ya fue aprobada anteriormente", 400)
  }

  const [solicitudActualizada, nuevoArtesano] = await prisma.$transaction([
    prisma.solicitud.update({
      where: { id_solicitud: id },
      data: {
        estado_solicitud: "APROBADO",
        observaciones_admin: observaciones_admin ?? solicitud.observaciones_admin,
      },
    }),
    prisma.artesano.create({
      data: {
        descripcion_artesano: solicitud.descripcion_emprendimiento,
        trayectoria: "Inicial",
        usuarioId: solicitud.usuarioId,
        rubroId: solicitud.rubroId,
      },
      include: {
        usuario: {
          select: {
            nombre: true,
            apellido: true,
            email: true,
          },
        },
        rubro: true,
      },
    }),
  ]);

  return {
    solicitud: solicitudActualizada,
    artesano: nuevoArtesano,
  }
}

/*
// Acción del Organizador/Admin: evalúa la solicitud
export const evaluarSolicitud = async (id, evaluarSolicitudDTO) => {
  const { estado_solicitud, observaciones_admin } = evaluarSolicitudDTO;

  const solicitud = await prisma.solicitud.findUnique({
    where: { id_solicitud: id },
  });

  if (!solicitud) {
    throw crearError(`No existe una solicitud con id ${id}`, 404);
  }

  if (solicitud.estado_solicitud === "APROBADO") {
    throw crearError("La solicitud ya fue aprobada anteriormente", 400);
  }

  // CASO 1: Si el estado es APROBADO -> actualiza solicitud y crea el Artesano en transacción
  if (estado_solicitud === "APROBADO") {
    const [solicitudActualizada, nuevoArtesano] = await prisma.$transaction([
      prisma.solicitud.update({
        where: { id_solicitud: id },
        data: {
          estado_solicitud: "APROBADO",
          observaciones_admin: observaciones_admin ?? "Solicitud aprobada",
        },
      }),
      prisma.artesano.create({
        data: {
          descripcion_artesano: solicitud.descripcion_emprendimiento,
          trayectoria: "Inicial",
          usuarioId: solicitud.usuarioId,
          rubroId: solicitud.rubroId,
        },
        include: {
          usuario: { select: { nombre: true, apellido: true, email: true } },
          rubro: true,
        },
      }),
    ]);

    return { solicitud: solicitudActualizada, artesano: nuevoArtesano };
  }

  // CASO 2: Si es RECHAZADO o MODIFICACION_SOLICITADA -> actualiza estado y devuelve con observaciones_admin
  return prisma.solicitud.update({
    where: { id_solicitud: id },
    data: {
      estado_solicitud,
      observaciones_admin,
    },
    include: {
      usuario: { select: { id_usuario: true, nombre: true, apellido: true, email: true } },
      rubro: true,
    },
  });
};
*/


export const actualizarSolicitud = async (id, actualizarSolicitudDTO) => {
  if (actualizarSolicitudDTO.rubroId) {
    await verificarRubro(actualizarSolicitudDTO.rubroId)
  }

  return prisma.solicitud.update({
    where: { id_solicitud: id },
    data: actualizarSolicitudDTO,
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
  })
}

/*
// Acción del Postulante: modifica rubro o descripción y vuelve a PENDIENTE para que el admin la revise de nuevo
export const actualizarSolicitud = async (id, actualizarSolicitudDTO) => {
  const solicitud = await prisma.solicitud.findUnique({
    where: { id_solicitud: id },
  });

  if (!solicitud) {
    throw crearError(`No existe una solicitud con id ${id}`, 404);
  }

  if (solicitud.estado_solicitud === "APROBADO") {
    throw crearError("No se puede modificar una solicitud que ya fue aprobada", 400);
  }

  if (actualizarSolicitudDTO.rubroId) {
    await verificarRubro(actualizarSolicitudDTO.rubroId);
  }

  return prisma.solicitud.update({
    where: { id_solicitud: id },
    data: {
      ...actualizarSolicitudDTO,
      estado_solicitud: "PENDIENTE", // Vuelve a pendiente al enviar las correcciones
    },
    include: {
      usuario: { select: { id_usuario: true, nombre: true, apellido: true, email: true } },
      rubro: true,
    },
  });
};
*/

export const eliminarSolicitud = async (id) => {
  return prisma.solicitud.delete({
    where: { id_solicitud: id },
  })
}