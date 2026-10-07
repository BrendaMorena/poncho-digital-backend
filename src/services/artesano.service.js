import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";



export const obtenerArtesanos = async (criterios = {}) => {
  const {
    ordenarPor = "numero_stand",
    direccion = "asc",
    pagina = 1,
    limite = 10,
  } = criterios;
  
  const where = {
    estado: "ACTIVO",
  };
  
  const opcionesDeOrden = {
    numero_stand: { stand: { numero_stand: direccion } },
    nombre:      { usuario: { nombre: direccion } },
    apellido:    { usuario: { apellido: direccion } },
    createdAt:   { createdAt: direccion },
    id_artesano: { id_artesano: direccion }
  };

  const orderBy = [opcionesDeOrden[ordenarPor] || { id_artesano: "asc" }];
  if (ordenarPor !== "id_artesano") {
    orderBy.push({ id_artesano: "asc" }); 
  }

  const desplazamiento = (pagina - 1) * limite;

  const [artesanos, total] = await prisma.$transaction([
    prisma.artesano.findMany({
      where,
      orderBy,
      skip: desplazamiento,
      take: limite,
      include: {
        usuario: { 
          select: { 
            nombre: true, 
            apellido: true, 
            email: true, 
            localidad: true,
            telefono: true 
          } 
        },
        rubro: true,
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
      }
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
          email: true,
          localidad: true,
          telefono: true
        }
      },
      rubro: true,
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
    }
  });
};

export const actualizarArtesano = async (id, actualizarArtesanoDTO) => {
  const artesano = await prisma.artesano.findUnique({
    where: { id_artesano: id }
  });
  if (!artesano) throw crearError("El artesano no existe.", 404);
  
  const { nombre_emprendimiento, descripcion, rubroId } = actualizarArtesanoDTO;

  if (rubroId) {
    const rubro = await prisma.rubro.findUnique({
      where: { id_rubro: rubroId }
    });
    if (!rubro) throw crearError(`No existe un rubro con id ${rubroId}`, 404);
  }
  
  return await prisma.artesano.update({
    where: { id_artesano: id },
    data: {
      ...(nombre_emprendimiento && { nombre_emprendimiento }),
      ...(descripcion && { descripcion }),
      ...(rubroId && { rubroId }),
    },
    include: {
      usuario: { select: { nombre: true, apellido: true, email: true, localidad: true } },
      rubro: true
    }
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
