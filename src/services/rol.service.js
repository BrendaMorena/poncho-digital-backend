import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

const verificarRol = async (idRol) => {
  const rol = await prisma.rol.findUnique({
    where: { id_rol: idRol },
  });

  if (!rol) {
    throw crearError(`No existe un rol con id ${idRol}`, 404);
  }

  return rol;
};

const incluirRelaciones = {
  _count: {
    select: { usuarios: true },
  },
  usuarios: {
    select: {
      id_usuario: true,
      nombre: true,
      apellido: true,
      email: true,
    },
  },
};

export const obtenerRoles = async (criteriosConsulta) => {
  const { nombre, ordenarPor, direccion, pagina, limite } = criteriosConsulta;

  const where = {};

  if (nombre !== undefined) {
    where.nombre = {
      contains: nombre,
      mode: "insensitive",
    };
  }

  const orderBy = [{ [ordenarPor]: direccion }, { id_rol: "asc" }];

  const desplazamiento = (pagina - 1) * limite;

  const [roles, total] = await prisma.$transaction([
    prisma.rol.findMany({
      where,
      include: incluirRelaciones,
      orderBy,
      skip: desplazamiento,
      take: limite,
    }),
    prisma.rol.count({ where }),
  ]);

  return {
    roles,
    paginacion: {
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite),
    },
  };
};

export const obtenerRolPorId = async (rolId) => {
  return await prisma.rol.findUnique({
    where: {
      id_rol: rolId,
    },
    include: incluirRelaciones,
  });
};

export const crearRol = async (crearRolDTO) => {
  const { nombre, descripcion } = crearRolDTO;

  return await prisma.rol.create({
    data: {
      nombre,
      descripcion,
    },
    include: incluirRelaciones,
  });
};

export const actualizarRol = async (rolId, actualizarRolDTO) => {
  await verificarRol(rolId);

  const data = { ...actualizarRolDTO };

  return await prisma.rol.update({
    where: { id_rol: rolId },
    data,
    include: incluirRelaciones,
  });
};

export const eliminarRol = async (rolId) => {
  await verificarRol(rolId);

  const usuariosAsociados = await prisma.usuario.count({
    where: { rolId },
  });

  if (usuariosAsociados > 0) {
    throw crearError(
      "No se puede eliminar un rol que tiene usuarios asignados",
      400
    );
  }

  return await prisma.rol.delete({
    where: { id_rol: rolId },
  });
};
