import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";


export const obtenerArtesanos = async () => {
  return await prisma.artesano.findMany({
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
  }
});
}

export const obtenerArtesanoPorId = async (id) => {
return artesano = await prisma.artesano.findUnique({
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
  //Extraemos los datos del DTO
  const { descripcion, rubroId, nombre, apellido, localidadId } = actualizarArtesanoDTO;
  // Hacemos el update y lo retornamos
  return await prisma.artesano.update({
    where: { id_artesano: id },
    data: {
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

  await prisma.$transaction([
    prisma.artesano.delete({ where: { id_artesano: id } }),
    prisma.usuario.update({
      where: { id_usuario: artesano.usuarioId },
      data: { rolId: 3 } // Lo degradamos a visitante
    })
  ]);
};