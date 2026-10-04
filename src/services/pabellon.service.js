import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

const verificarPabellon = async (idPabellon) => {
  const pabellon = await prisma.pabellon.findUnique({
    where: { id_pabellon: idPabellon },
  });

  if (!pabellon) {
    throw crearError(`No existe un pabellón con id ${idPabellon}`, 404);
  }

  return pabellon;
};

export const obtenerPabellones = async (criteriosConsulta) => {
  const { nombre_pabellon, ordenarPor, direccion, pagina, limite } = criteriosConsulta;

  const where = {};

  if (nombre_pabellon !== undefined) {
    where.nombre_pabellon = {
      contains: nombre_pabellon,
      mode: "insensitive",
    };
  }

  const orderBy = [{ [ordenarPor]: direccion }, { id_pabellon: "asc" }];

  const include = {
    sectores: true,
  };

  const desplazamiento = (pagina - 1) * limite;

  const [pabellones, total] = await prisma.$transaction([
    prisma.pabellon.findMany({
      where,
      include,
      orderBy,
      skip: desplazamiento,
      take: limite,
    }),
    prisma.pabellon.count({ where }),
  ]);

  return {
    pabellones,
    paginacion: {
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite),
    },
  };
};

export const obtenerPabellonPorId = async (pabellonId) => {
  return await prisma.pabellon.findUnique({
    where: {
      id_pabellon: pabellonId,
    },
    include: {
      sectores: true,
    },
  });
};

export const crearPabellon = async (crearPabellonDTO) => {
  const { nombre_pabellon, descripcion_pabellon } = crearPabellonDTO;

  return await prisma.pabellon.create({
    data: {
      nombre_pabellon,
      descripcion_pabellon,
    },
    include: {
      sectores: true,
    },
  });
};

export const actualizarPabellon = async (pabellonId, actualizarPabellonDTO) => {
  await verificarPabellon(pabellonId);

  const data = { ...actualizarPabellonDTO };

  return await prisma.pabellon.update({
    where: { id_pabellon: pabellonId },
    data,
    include: {
      sectores: true,
    },
  });
};

export const eliminarPabellon = async (pabellonId) => {
  await verificarPabellon(pabellonId);

  const sectoresAsociados = await prisma.sector.count({
    where: { pabellonId },
  });

  if (sectoresAsociados > 0) {
    throw crearError(
      "No se puede eliminar un pabellón que tiene sectores asociados",
      400
    );
  }

  return await prisma.pabellon.delete({
    where: { id_pabellon: pabellonId },
  });
};
