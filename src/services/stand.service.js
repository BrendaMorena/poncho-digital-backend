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
  const { numero_stand, estado, sectorId, rubroId, ordenarPor, direccion, pagina, limite } = criteriosConsulta
  
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
      rubroId: rubroId,
    };
  }

  const orderBy = ordenarPor === "rubro"
    ? [{ artesano: { rubro: { nombre: direccion } } }, { id_stand: "asc" }]
    : [{ [ordenarPor]: direccion }, { id_stand: "asc" }];

  const include = {
    sector: {
      include: { pabellon: true },
    },
    artesano: {
      include: { rubro: true },
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
      sector: { include: { pabellon: true } },
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
    data: data,
    include: {
      sector: { include: { pabellon: true } },
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
