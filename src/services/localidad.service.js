import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

export const crearLocalidad = async (crearLocalidadDTO) => {
  const { nombre_locacion } = crearLocalidadDTO;

  return prisma.localidad.create({
    data: {
      nombre_locacion,
    },
  });
};

export const consultarLocalidades = async (criteriosConsulta) => {
  const { buscar, ordenPor, direccion, pagina, limite } = criteriosConsulta;

  const where = {};

  if (buscar) {
    where.nombre_locacion = {
      contains: buscar,
      mode: "insensitive",
    };
  }

  const desplazamiento = (pagina - 1) * limite;

  const orderBy = [{ [ordenPor]: direccion }];
  if (ordenPor !== "id_localidad") {
    orderBy.push({ id_localidad: "asc" });
  }

  const [localidades, total] = await prisma.$transaction([
    prisma.localidad.findMany({
      where,
      orderBy,
      skip: desplazamiento,
      take: limite,
    }),
    prisma.localidad.count({ where }),
  ]);

  return {
    localidades,
    paginacion: {
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite),
    },
  };
};

export const obtenerLocalidadPorId = async (id) => {
  return prisma.localidad.findUnique({
    where: { id_localidad: id },
  });
};

export const actualizarLocalidad = async (id, actualizarLocalidadDTO) => {
  const localidad = await prisma.localidad.findUnique({
    where: { id_localidad: id },
  });

  if (!localidad) {
    throw crearError(`No existe una localidad con id ${id}`, 404);
  }

  const { nombre_locacion } = actualizarLocalidadDTO;

  return prisma.localidad.update({
    where: { id_localidad: id },
    data: {
      nombre_locacion,
    },
  });
};

export const eliminarLocalidad = async (id) => {
  const localidad = await prisma.localidad.findUnique({
    where: { id_localidad: id },
    include: {
      _count: {
        select: {
          usuarios: true,
        },
      },
    },
  });

  if (!localidad) {
    throw crearError(`No existe una localidad con id ${id}`, 404);
  }

  if (localidad._count.usuarios > 0) {
    throw crearError(
      `No se puede eliminar la localidad '${localidad.nombre_locacion}' porque tiene usuarios asociados`,
      400
    );
  }

  return prisma.localidad.delete({
    where: { id_localidad: id },
  });
};
