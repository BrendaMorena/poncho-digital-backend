import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";


export const obtenerArtesanos = async (page, limit, sortBy, sortOrder) => {
  const skip = (page - 1) * limit;
  // Creamos un "diccionario" con todas las opciones posibles de ordenamiento
  const opcionesDeOrden = {
    nombre:      { usuario: { nombre: sortOrder } },
    apellido:    { usuario: { apellido: sortOrder } },
    createdAt:   { createdAt: sortOrder },
    id_artesano: { id_artesano: sortOrder }
  };
 
  const artesanos = await prisma.artesano.findMany({
    skip: skip,
    take: limit,
    orderBy: opcionesDeOrden[sortBy], 
    where: { estado: 'ACTIVO' }, 
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
      rubro: true
    }
  });
  
  const totalArtesanos = await prisma.artesano.count({ where: { estado: 'ACTIVO' }});
  
  return {
    paginacion: {
      totalResultados: totalArtesanos,
      paginasTotales: Math.ceil(totalArtesanos / limit),
      paginaActual: page,
      limitePorPagina: limit
    },
    datos: artesanos
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
        rubro: true 
      }
    });
}

export const crearArtesano = async (crearArtesanoDTO) => {
  const { descripcion, usuarioId, rubroId } = crearArtesanoDTO;
  return await prisma.artesano.create({
    data: {
      descripcion: descripcion.trim(),
      usuarioId: usuarioId,
      rubroId: rubroId
    },
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
      rubro: true 
    }
  });
};

export const actualizarArtesano = async (id, actualizarArtesanoDTO) => {
  //Verificamos si existe
  const artesano = await prisma.artesano.findUnique({
    where: { id_artesano: id }
  });
  if (!artesano) throw crearError("El artesano no existe.", 404);
  
  const { nombre_emprendimiento, descripcion, rubroId, nombre, apellido, localidadId } = actualizarArtesanoDTO;
  
  return await prisma.artesano.update({
    where: { id_artesano: id },
    data: {
      ...(nombre_emprendimiento && { nombre_emprendimiento: nombre_emprendimiento.trim() }),
      ...(descripcion && { descripcion: descripcion.trim() }),
      ...(rubroId && { rubroId: rubroId }),
      ...((nombre || apellido || localidadId) && {
        usuario: {
          update: {
            ...(nombre && { nombre: nombre.trim() }),
            ...(apellido && { apellido: apellido.trim() }),
            ...(localidadId && { localidadId: localidadId })
          }
        }
      })
    },
    include: {
      usuario: { select: { nombre: true, apellido: true, email: true, localidad: true } },
      rubro: true
    }
  });
};


export const eliminarArtesano = async (id) => {
 
  const artesano = await prisma.artesano.findUnique({
    where: { id_artesano: id }
  });
  if (!artesano) throw crearError("El artesano no existe.", 404);

  // BORRADO LÓGICO: Solo cambiamos el estado, no destruimos la cuenta ni sus productos
  await prisma.artesano.update({ 
    where: { id_artesano: id },
    data: { estado: 'INACTIVO' }
  });
};