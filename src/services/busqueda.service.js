import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

export const crearBusqueda = async (datosBusqueda) => {
  const { termino_busqueda, rubroId, pabellonId, localidadId } = datosBusqueda;
  return prisma.busqueda.create({
    data: {
      termino_busqueda: termino_busqueda || null,
      rubroId: rubroId || null,
      pabellonId: pabellonId || null,
      localidadId: localidadId || null,
    },
  });
};

export const consultarBusquedas = async (criterios) => {
  const {
    termino_busqueda,
    rubroId,
    pabellonId,
    localidadId,
    fechaDesde,
    fechaHasta,
    ordenarPor,
    direccion,
    pagina,
    limite,
  } = criterios;
  const where = {};
  if (termino_busqueda) {
    where.termino_busqueda = {
      contains: termino_busqueda,
      mode: "insensitive",
    };
  }
  if (rubroId) where.rubroId = rubroId;
  if (pabellonId) where.pabellonId = pabellonId;
  if (localidadId) where.localidadId = localidadId;
  if (fechaDesde || fechaHasta) {
    where.createdAt = {};
    if (fechaDesde) where.createdAt.gte = fechaDesde;
    if (fechaHasta) where.createdAt.lte = fechaHasta;
  }
  const desplazamiento = (pagina - 1) * limite;
  const orderBy = [{ [ordenarPor]: direccion }];
  if (ordenarPor !== "id_busqueda") {
    orderBy.push({ id_busqueda: "asc" });
  }
  
  const [busquedas, total] = await prisma.$transaction([
    prisma.busqueda.findMany({
      where,
      orderBy,
      skip: desplazamiento,
      take: limite,
      include: {
        rubro: { select: { id_rubro: true, nombre: true } },
        pabellon: { select: { id_pabellon: true, nombre_pabellon: true } },
        localidad: { select: { id_localidad: true, nombre_locacion: true } },
      },
    }),
    prisma.busqueda.count({ where }),
  ]);
  return {
    busquedas,
    paginacion: {
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite),
    },
  };
};

export const obtenerBusquedaPorId = async (id) => {
  return prisma.busqueda.findUnique({
    where: { id_busqueda: id },
    include: {
      rubro: true,
      pabellon: true,
      localidad: true,
    },
  });
};

export const eliminarBusqueda = async (id) => {
  const busqueda = await prisma.busqueda.findUnique({
    where: { id_busqueda: id },
  });
  if (!busqueda) {
    throw crearError(`No existe una búsqueda con id ${id}`, 404);
  }
  return prisma.busqueda.delete({
    where: { id_busqueda: id },
  });
};