import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

const verificarPabellon = async (pabellonId) => {
  const pabellon = await prisma.pabellon.findUnique({
    where: { id_pabellon: pabellonId },
  });

  if (!pabellon) {
    throw crearError(`No existe un pabellón con id ${pabellonId}`, 404);
  }

  return pabellon;
};

const verificarSector = async (idSector) => {
  const sector = await prisma.sector.findUnique({
    where: { id_sector: idSector },
  });

  if (!sector) {
    throw crearError(`No existe un sector con id ${idSector}`, 404);
  }

  return sector;
};

export const obtenerSectores = async (criteriosConsulta) => {
  const {
    nombre_sector,
    codigo_sector,
    pabellonId,
    ordenarPor,
    direccion,
    pagina,
    limite,
  } = criteriosConsulta;

  const where = {};

  if (nombre_sector !== undefined) {
    where.nombre_sector = {
      contains: nombre_sector,
      mode: "insensitive",
    };
  }

  if (codigo_sector !== undefined) {
    where.codigo_sector = {
      contains: codigo_sector,
      mode: "insensitive",
    };
  }

  if (pabellonId !== undefined) {
    where.pabellonId = pabellonId;
  }

  const orderBy = [{ [ordenarPor]: direccion }, { id_sector: "asc" }];

  const include = {
    pabellon: true,
    stands: true,
  };

  const desplazamiento = (pagina - 1) * limite;

  const [sectores, total] = await prisma.$transaction([
    prisma.sector.findMany({
      where,
      include,
      orderBy,
      skip: desplazamiento,
      take: limite,
    }),
    prisma.sector.count({ where }),
  ]);

  return {
    sectores,
    paginacion: {
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite),
    },
  };
};

export const obtenerSectorPorId = async (sectorId) => {
  return await prisma.sector.findUnique({
    where: {
      id_sector: sectorId,
    },
    include: {
      pabellon: true,
      stands: true,
    },
  });
};

export const crearSector = async (crearSectorDTO) => {
  const { codigo_sector, nombre_sector, pabellonId } = crearSectorDTO;

  if (pabellonId) {
    await verificarPabellon(pabellonId);
  }

  return await prisma.sector.create({
    data: {
      codigo_sector,
      nombre_sector,
      pabellonId: pabellonId ?? null,
    },
    include: {
      pabellon: true,
    },
  });
};

export const actualizarSector = async (sectorId, actualizarSectorDTO) => {
  await verificarSector(sectorId);

  const data = { ...actualizarSectorDTO };

  if (data.pabellonId) {
    await verificarPabellon(data.pabellonId);
  }

  return await prisma.sector.update({
    where: { id_sector: sectorId },
    data,
    include: {
      pabellon: true,
      stands: true,
    },
  });
};

export const eliminarSector = async (sectorId) => {
  await verificarSector(sectorId);

  const standsAsociados = await prisma.stand.count({
    where: { sectorId },
  });

  if (standsAsociados > 0) {
    throw crearError(
      "No se puede eliminar un sector que contiene stands asociados",
      400
    );
  }

  return await prisma.sector.delete({
    where: { id_sector: sectorId },
  });
};
