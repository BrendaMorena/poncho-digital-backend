import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

export const obtenerRubros = async () => {
  return await prisma.rubro.findMany({
    select: {
      id_rubro: true,
      nombre: true,
      _count: {
        select: {
          artesanos: true,
          sectores: true,
        },
      },
    },
    orderBy: { nombre: "asc" },
  });
};

export const obtenerRubroPorId = async (id) => {
  return await prisma.rubro.findUnique({
    where: { id_rubro: id },
    select: {
      id_rubro: true,
      nombre: true,
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
  const { nombre } = crearRubroDTO;
  return await prisma.rubro.create({
    data: {
      nombre,
    },
    select: {
      id_rubro: true,
      nombre: true,
    },
  });
};

export const actualizarRubro = async (id, actualizarRubroDTO) => {
  const rubro = await prisma.rubro.findUnique({
    where: { id_rubro: id },
  });
  if (!rubro) throw crearError("Rubro no encontrado", 404);

  const { nombre } = actualizarRubroDTO;
  return await prisma.rubro.update({
    where: { id_rubro: id },
    data: {
      nombre,
    },
    select: {
      id_rubro: true,
      nombre: true,
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
