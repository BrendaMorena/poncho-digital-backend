import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";



export const obtenerArtesanos = async (criteriosConsulta) => {
  const {
    nombre_emprendimiento,
    rubroId,
    ordenarPor,
    direccion,
    pagina,
    limite,
  } = criteriosConsulta;
  
  const where = {
    estado: "ACTIVO",
  };
  if (nombre_emprendimiento !== undefined) {
    where.nombre_emprendimiento = {
      contains: nombre_emprendimiento,
      mode: "insensitive",
    };
  }
  if (rubroId !== undefined) {
    where.rubroId = rubroId;
  }
  
  const orderBy = [{ [ordenarPor]: direccion }, { id_artesano: "asc" }];
  
  const include = {
    usuario: { 
      select: { 
        nombre: true, 
        apellido: true, 
        localidad: true,
      } 
    },
    rubro: {
      select: {
        nombre_rubro: true,
      }
    },
    stand: {
      select: {
        id_stand: true,
        numero_stand: true,
        sector: {
          select: {
            nombre_sector: true,
            pabellon: { select: { nombre_pabellon: true } }
          }
        }
      }
    }
  };
  
  const desplazamiento = (pagina - 1) * limite;
  
  const [artesanos, total] = await prisma.$transaction([
    prisma.artesano.findMany({
      where,
      include,
      orderBy,
      skip: desplazamiento,
      take: limite,
    }),
    prisma.artesano.count({ where }),
  ]);
  return {
    artesanos,
    paginacion: {
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite),
    },
  };
};

export const obtenerArtesanoPorId = async (id) => {
  return await prisma.artesano.findUnique({
    where: { id_artesano: id },
    include: {
      usuario: { 
        select: { 
          nombre: true,
          apellido: true,
          localidad: true,
        }
      },
      rubro: {
        select: {
          id_rubro: true,
          nombre_rubro: true,
        },
      },
      stand: {
        select: {
          numero_stand: true,
          sector: {
            select: {
              nombre_sector: true,
              pabellon: { select: { nombre_pabellon: true } }
            }
          }
        }
      }
    }
  });
};

export const crearArtesano = async (crearArtesanoDTO, tx = prisma) => {
  const {
    nombre_emprendimiento,
    descripcion_emprendimiento,
    usuarioId,
    rubroId,
    estado = "ACTIVO",
  } = crearArtesanoDTO;
  
  const usuario = await tx.usuario.findUnique({
    where: { id_usuario: usuarioId },
  });
  if (!usuario) {
    throw crearError(`No existe un usuario con id ${usuarioId}`, 404);
  }
  
  const artesanoExistente = await tx.artesano.findUnique({
    where: { usuarioId },
  });
  if (artesanoExistente) {
    throw crearError("Este usuario ya se encuentra registrado como artesano", 409);
  }
  
  const rubro = await tx.rubro.findUnique({
    where: { id_rubro: rubroId },
  });
  if (!rubro) {
    throw crearError(`No existe un rubro con id ${rubroId}`, 404);
  }
  
  return await tx.artesano.create({
    data: {
      nombre_emprendimiento,
      descripcion_emprendimiento,
      usuarioId,
      rubroId,
      estado,
    },
    include: {
      usuario: {
        select: {
          id_usuario: true,
          nombre: true,
          apellido: true,
          email: true,
          telefono: true,
        },
      },
      rubro: {
        select: {
          id_rubro: true,
          nombre_rubro: true,
        },
      },
    },
  });
};

export const actualizarArtesano = async (id, actualizarArtesanoDTO) => {
  const artesano = await prisma.artesano.findUnique({
    where: { id_artesano: id }
  });
  if (!artesano) throw crearError("El artesano no existe.", 404);
  
  const { 
    nombre_emprendimiento, 
    descripcion_emprendimiento, 
    rubroId 
  } = actualizarArtesanoDTO;

  if (rubroId) {
    const rubro = await prisma.rubro.findUnique({
      where: { id_rubro: rubroId }
    });
    if (!rubro) throw crearError(`No existe un rubro con id ${rubroId}`, 404);
  }
  
  return await prisma.artesano.update({
    where: { id_artesano: id },
    data: {
      nombre_emprendimiento,
      descripcion_emprendimiento,
      rubroId,
    },
    include: {
      usuario: {
        select: {
          id_usuario: true,
          nombre: true,
          apellido: true,
          email: true,
          telefono: true,
        },
      },
      rubro: {
        select: {
          id_rubro: true,
          nombre_rubro: true,
        },
      },
    },
  });
};


export const eliminarArtesano = async (id) => {
  const artesano = await prisma.artesano.findUnique({
    where: { id_artesano: id },
    include: { stand: true },
  });
  if (!artesano) throw crearError("El artesano no existe.", 404);

  return prisma.$transaction(async (tx) => {
    // Si tenía stand asignado, lo liberamos para que vuelva a estar DISPONIBLE
    if (artesano.stand) {
      await tx.stand.update({
        where: { id_stand: artesano.stand.id_stand },
        data: {
          artesanoId: null,
          estado: "DISPONIBLE",
        },
      });
    }

    // BORRADO LÓGICO: Solo cambiamos el estado, no destruimos la cuenta ni sus productos
    return await tx.artesano.update({ 
      where: { id_artesano: id },
      data: { estado: 'INACTIVO' }
    });
  });
};
