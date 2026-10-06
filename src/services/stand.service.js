import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

const verificarSector = async (sectorId) => {
  const sector = await prisma.sector.findUnique({
    where: { id_sector: sectorId },
  });

  if (!sector) {
    throw crearError(`No existe un sector con id ${sectorId}`, 404);
  }

  return sector
};

const verificarStand = async (idStand) => {
  const standActual = await prisma.stand.findUnique({
    where: { id_stand: idStand },
  });
  if (!standActual) {
    throw crearError(`No existe un Stand con id ${idStand}`, 404);
  }

  return standActual
}

export const obtenerStands = async (criteriosConsulta) => {
  const { numero_stand, estado, sectorId, rubroId, termino_busqueda, ordenarPor, direccion, pagina, limite } = criteriosConsulta
  
  const where = {}

  if (numero_stand !== undefined) {
    where.numero_stand = numero_stand;
  }

  if (estado !== undefined) {
    where.estado = estado;
  }

  if(sectorId !== undefined){
    where.sectorId = sectorId
  }

  if(rubroId !== undefined){
    where.artesano = {
      ...where.artesano,
      rubroId: rubroId,
    };
  }

  if (termino_busqueda) {
    where.OR = [
      { numero_stand: { contains: termino_busqueda, mode: "insensitive" } },
      {
        artesano: {
          nombre_emprendimiento: { contains: termino_busqueda, mode: "insensitive" },
        },
      },
      {
        artesano: {
          usuario: {
            nombre: { contains: termino_busqueda, mode: "insensitive" },
          },
        },
      },
      {
        artesano: {
          usuario: {
            apellido: { contains: termino_busqueda, mode: "insensitive" },
          },
        },
      },
    ];
  }

  const orderBy = ordenarPor === "rubro"
    ? [{ artesano: { rubro: { nombre: direccion } } }, { id_stand: "asc" }]
    : [{ [ordenarPor]: direccion }, { id_stand: "asc" }];

  const include = {
    sector: {
      include: { pabellon: true },
    },
    artesano: {
      select: {
        id_artesano: true,
        nombre_emprendimiento: true,
        usuario: {
          select: {
            nombre: true,
            apellido: true,
          },
        },
      },
    },
  };

  if (pagina && limite) {
    const desplazamiento = (pagina - 1) * limite;
    const [stands, total] = await prisma.$transaction([
      prisma.stand.findMany({
        where,
        include,
        orderBy,
        skip: desplazamiento,
        take: limite,
      }),
      prisma.stand.count({ where }),
    ]);

    return {
      stands,
      paginacion: {
        pagina,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite),
      },
    };
  }

  const stands = await prisma.stand.findMany({
    where,
    include,
    orderBy,
  });

  return {
    stands,
    paginacion: null, //{ stands, total: stands.length }
  };

};

export const obtenerStandPorId = async (standId) => {
  return await prisma.stand.findUnique({
    where: {
      id_stand: standId,
    },
    include: {
      sector: { include: { pabellon: true } },
      artesano: { include: { rubro: true } },
    }
  });
};

export const crearStand = async (crearStandDTO) => {
  const { numero_stand, coordenada, sectorId } = crearStandDTO;

  if (sectorId) {
    await verificarSector(sectorId);
  }

  return prisma.stand.create({
    data: {
      numero_stand: numero_stand,
      coordenada: coordenada,
      sectorId: sectorId,
      estado: "DISPONIBLE",
    },
    include: {
      sector: true,
    },
  });
};

export const actualizarStand = async (idStand, actualizarStandDTO) => {
  await verificarStand(idStand);

  const data = { ...actualizarStandDTO };

  if (data.sectorId) {
    await verificarSector(data.sectorId);
  }

  // Regla de negocio: si el stand se libera o entra en mantenimiento, desvinculamos el artesano
  if (data.estado === "DISPONIBLE" || data.estado === "MANTENIMIENTO") {
    data.artesanoId = null;
  }

  return prisma.stand.update({
    where: { id_stand: idStand },
    data,
    include: {
      sector: true,
      artesano: true,
    },
  });
};


export const eliminarStand = async (standId) => {
  const standActual = await verificarStand(standId)

  if(standActual.artesanoId){
    throw crearError("No se puede eliminar un Stand que tiene un artesano asignado", 400)
  }

  return await prisma.stand.delete({
    where: { id_stand: standId },
  });
};

export const asignarArtesanoAStand = async ({ artesanoId, standId }) => {
  const artesano = await prisma.artesano.findUnique({
    where: { id_artesano: artesanoId },
    include: {
      stand: true,
    },
  });

  if (!artesano) {
    throw crearError(`No existe un artesano con id ${artesanoId}`, 404);
  }

  if (artesano.estado !== "ACTIVO") {
    throw crearError(
      `Solo se puede asignar un stand a artesanos en estado ACTIVO (estado actual: ${artesano.estado})`,
      400
    );
  }

  if (artesano.stand) {
    throw crearError(
      `El artesano con id ${artesanoId} ya tiene asignado el stand número '${artesano.stand.numero_stand}' (id: ${artesano.stand.id_stand})`,
      409
    );
  }

  return prisma.$transaction(async (tx) => {
    let standElegido;

    if (standId) {
      standElegido = await tx.stand.findUnique({
        where: { id_stand: standId },
      });

      if (!standElegido) {
        throw crearError(`No existe un stand con id ${standId}`, 404);
      }

      if (standElegido.estado !== "DISPONIBLE" || standElegido.artesanoId !== null) {
        throw crearError(
          `El stand '${standElegido.numero_stand}' (id: ${standId}) no está disponible (estado actual: ${standElegido.estado})`,
          409
        );
      }
    } else {
      standElegido = await tx.stand.findFirst({
        where: {
          estado: "DISPONIBLE",
          artesanoId: null,
          sector: {
            rubroId: artesano.rubroId,
          },
        },
        orderBy: {
          id_stand: "asc",
        },
      });

      if (!standElegido) {
        throw crearError(
          "No hay stands disponibles en el predio para el rubro del artesano. Indique manualmente un 'standId' alternativo o libere cupos.",
          409
        );
      }
    }

    return await tx.stand.update({
      where: { id_stand: standElegido.id_stand },
      data: {
        artesanoId: artesano.id_artesano,
        estado: "OCUPADO",
      },
      include: {
        sector: true,
        artesano: true,
      },
    });
  });
};

export const liberarStand = async (idStand) => {
  await verificarStand(idStand);

  const stand = await prisma.stand.findUnique({
    where: { id_stand: idStand },
  });

  if (!stand.artesanoId && stand.estado === "DISPONIBLE") {
    throw crearError(
      `El stand con id ${idStand} ya se encuentra disponible y sin artesano asignado`,
      400
    );
  }

  return await prisma.stand.update({
    where: { id_stand: idStand },
    data: {
      artesanoId: null,
      estado: "DISPONIBLE",
    },
    include: {
      sector: true,
    },
  });
};

