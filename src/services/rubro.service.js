import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

export const obtenerRubros = async () => {
  return await prisma.rubro.findMany({
    select: {
      id_rubro: true,
      nombre_rubro: true,
      _count: {
        select: {
          artesanos: true,
          sectores: true,
        },
      },
    },
    orderBy: { nombre_rubro: "asc" },
  });
};

export const obtenerRubroPorId = async (id) => {
  return await prisma.rubro.findUnique({
    where: { id_rubro: id },
    select: {
      id_rubro: true,
      nombre_rubro: true,
      sectores: {
        select: {
          id_sector: true,
          codigo_sector: true,
          nombre_sector: true,
        },
      },
      _count: {
        select: {
          artesanos: true,
        },
      },
    },
  });
};

export const crearRubro = async (crearRubroDTO) => {
  const { nombre_rubro } = crearRubroDTO;
  return await prisma.rubro.create({
    data: {
      nombre_rubro,
    },
    select: {
      id_rubro: true,
      nombre_rubro: true,
    },
  });
};

export const actualizarRubro = async (id, actualizarRubroDTO) => {
  const rubro = await prisma.rubro.findUnique({
    where: { id_rubro: id },
  });
  if (!rubro) throw crearError("Rubro no encontrado", 404);

  const { nombre_rubro } = actualizarRubroDTO;
  return await prisma.rubro.update({
    where: { id_rubro: id },
    data: {
      nombre_rubro,
    },
    select: {
      id_rubro: true,
      nombre_rubro: true,
    },
  });
};

export const eliminarRubro = async (id) => {
  const rubro = await prisma.rubro.findUnique({
    where: { id_rubro: id },
  });
  if (!rubro) throw crearError("Rubro no encontrado", 404);

  return await prisma.rubro.delete({
    where: { id_rubro: id },
  });
};
