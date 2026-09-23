import { prisma } from "../config/prisma.js";
import { crearError } from "../utils/errores.js"

const verificarArtesano = async (artesanoId) => {
  const artesano = await prisma.artesano.findUnique({
    where: { id_artesano: artesanoId },
  })

  if (!artesano) {
    throw crearError(`No existe un artesano con id ${artesanoId}`, 400)
  }
}

export const crearProducto = async (crearProductoDTO) => {
  const { nombre_producto, precio, artesanoId } = crearProductoDTO

  if (artesanoId){
    await verificarArtesano(artesanoId)
  }

  return prisma.producto.create({
    data: {
      nombre_producto,
      precio,
      artesanoId,
    },
    include: {
      artesano: true,
    },
  })
}

export const consultarProductos = async (criteriosConsulta) => {
  const {
    nombre_producto,
    artesanoId,
    rubroId,
    precioDesde,
    precioHasta,
    ordenPor,
    direccion,
    pagina,
    limite,
  } = criteriosConsulta

  const where = {};

  if (nombre_producto !== undefined) {
    where.nombre_producto = {
      contains: nombre_producto,
      mode: 'insensitive',
    };
  }

  if (artesanoId !== undefined) {
    where.artesanoId = artesanoId;
  }

  if (rubroId !== undefined) {
    where.artesano = {
      rubroId: rubroId,
    };
  }

  if (precioDesde !== undefined || precioHasta !== undefined) {
    where.precio = {};
    if (precioDesde !== undefined) where.precio.gte = precioDesde;
    if (precioHasta !== undefined) where.precio.lte = precioHasta;
  }

  const desplazamiento = (pagina - 1) * limite;

  const [productos, total] = await prisma.$transaction([
    prisma.producto.findMany({
      where,
      orderBy: [
        { [ordenPor]: direccion },
        { id_producto: 'asc' }, 
      ],
      skip: desplazamiento,
      take: limite,
      include: {
        artesano: {
          include: {
            rubro: true,
            usuario: {
              select: {
                nombre: true,
                apellido: true,
              },
            },
          },
        },
      },
    }),
    prisma.producto.count({ where }),
  ]);

  return {
    productos,
    paginacion: {
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite),
    },
  }
}

export const obtenerProductoPorId = async (id) => {
  return prisma.producto.findUnique({
    where: { id_producto: id },
    include: { artesano: true },
  })
}

export const actualizarProducto = async (id, actualizarProductoDTO) => {
  return prisma.producto.update({
    where: { id_producto: id },
    data: actualizarProductoDTO,
    include: {
      artesano: true,
    },
  })
}


export const eliminarProducto = async (id) => {
  return prisma.producto.delete({
    where: { id_producto: id },
  })
}