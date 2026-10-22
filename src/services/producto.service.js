import prisma from "../config/prisma.js";

export const crearProducto = async (crearProductoDTO, usuarioId) => {
  const { nombre_producto, precio } = crearProductoDTO;

  return prisma.producto.create({
    data: {
      nombre_producto,
      precio,
      artesano: {
        connect: { usuarioId },
      },
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
  } = criteriosConsulta;

  const where = {};

  if (nombre_producto !== undefined) {
    where.nombre_producto = {
      contains: nombre_producto,
      mode: "insensitive",
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
      orderBy: [{ [ordenPor]: direccion }, { id_producto: "asc" }],
      skip: desplazamiento,
      take: limite,
      select: {
        id_producto: true,
        nombre_producto: true,
        precio: true,
        artesano: {
          select: {
            id_artesano: true,
            nombre_emprendimiento: true,
            rubro: {
              select: {
                id_rubro: true,
                nombre_rubro: true,
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
  };
};

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
};

export const actualizarProducto = async (id, actualizarProductoDTO, usuarioId) => {
  return prisma.producto.update({
    where: {
      id_producto: id,
      artesano: {
        usuarioId,
      },
    },
    data: actualizarProductoDTO,
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
  return prisma.producto.delete({
    where: {
      id_producto: id,
      artesano: {
        usuarioId,
      },
    },
  });
};
