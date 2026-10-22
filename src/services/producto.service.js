import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js"

const verificarArtesano = async (usuarioId, tx = prisma) => {
  const artesano = await tx.artesano.findUnique({
    where: { usuarioId },
  });

  if (!artesano) {
    throw crearError("No se encontró un perfil de artesano asociado a este usuario", 404);
  }

  return artesano;
};

export const crearProducto = async (crearProductoDTO, usuarioId) => {
  const { nombre_producto, precio } = crearProductoDTO;

  const artesano = await verificarArtesano(usuarioId);

  return prisma.producto.create({
    data: {
      nombre_producto,
      precio,
      artesanoId: artesano.id_artesano,
    },
  });
};

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
      select: {
        id_producto: true,
        nombre_producto: true,
        precio:true,
        artesano: {
          select: {
            id_artesano: true,
            nombre_emprendimiento:true,
            rubro:{
              select: {
                id_rubro: true,
                nombre_rubro: true
              }
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

export const obtenerMisProductos = async (usuarioId) => {
  return prisma.producto.findMany({
    where: {
      artesano: {
        usuarioId: usuarioId,
      },
    },
    select: {
      id_producto: true,
      nombre_producto: true,
      precio: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const obtenerProductoPorId = async (id) => {
  return prisma.producto.findUnique({
    where: { id_producto: id },
    include: {
      artesano: {
        select: {
          id_artesano: true,
          nombre_emprendimiento: true,
          descripcion_emprendimiento: true,
          rubro: {
            select: {
              id_rubro: true,
              nombre_rubro: true,
            },
          },
          usuario: {
            select: {
              nombre: true,
              apellido: true,
              telefono: true,
            },
          },
        },
      },
    },
  });
}

export const actualizarProducto = async (id, actualizarProductoDTO, usuarioId) => {
  const producto = await prisma.producto.findFirst({
    where: {
      id_producto: id,
      artesano: {
        usuarioId: usuarioId,
      },
    },
  });

  if (!producto) {
    throw crearError(`No existe un producto con id ${id}`, 404);
  }

  const data = {};
  if (actualizarProductoDTO.nombre_producto !== undefined) {
    data.nombre_producto = actualizarProductoDTO.nombre_producto;
  }
  if (actualizarProductoDTO.precio !== undefined) {
    data.precio = actualizarProductoDTO.precio;
  }

  return prisma.producto.update({
    where: { id_producto: id },
    data,
    include: {
      artesano: {
        select: {
          id_artesano: true,
          nombre_emprendimiento: true,
        },
      },
    },
  });
};

export const eliminarProducto = async (id, usuarioId) => {
  const producto = await prisma.producto.findFirst({
    where: {
      id_producto: id,
      artesano: {
        usuarioId: usuarioId,
      },
    },
  });

  if (!producto) {
    throw crearError(`No existe un producto con id ${id}`, 404);
  }

  return prisma.producto.delete({
    where: { id_producto: id },
  });
};