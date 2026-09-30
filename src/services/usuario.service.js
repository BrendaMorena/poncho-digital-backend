import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";

export const obtenerUsuarios = async (page, limit, sortBy, sortOrder) => {
  const skip = (page - 1) * limit;
  // Creamos un "diccionario" con todas las opciones posibles de ordenamiento
  const opcionesOrden = {
    nombre: { nombre: sortOrder },
    apellido: { apellido: sortOrder },
    email: { email: sortOrder }
  };
  const usuarios = await prisma.usuarios.findMany({
    skip: skip,
    take: limit,
    orderBy: opcionesOrden[sortBy],
    include: {
      localidad: true
    }
 });
  const totalUsuarios= await prisma.usuarios.count();

  return {
    paginacion: {
      totalResultados: totalUsuarios,
      paginasTotales: Math.ceil(totalUsuarios / limit),
      paginaActual: page,
      limitePorPagina: limit
    },
    datos: usuarios
  };
};

export const obtenerUsuarioPorId = async (id) =>{
  return await prisma.usuarios.findUnique({
    where: { id_usuario: id },
    include: {
      localidad: true 
    }
  });
}

export const crearUsuario = async (crearUsuarioDto) => {
  const { nombre, apellido, password, telefono, email, localidadId } = crearUsuarioDto;
  return await prisma.usuarios.create({
    data:{
      nombre: nombre,
      apellido: apellido,
      password: password,
      telefono: telefono,
      email: email,
      localidadId: localidadId
    }
  })
};

export const actualizarUsuario = async (id, actualizarUsuarioDto) => {
  const usuario = await prisma.usuarios.findUnique({
    where: { id_usuario: id }
  });
  if (!usuario) throw crearError("El usuario no existe.", 404); 

  const { nombre, apellido, password, telefono, email, localidadId } = actualizarUsuarioDto;

  return await prisma.usuarios.update({
    where: { id_usuario: id },
    data: {
      nombre: nombre,
      apellido: apellido,
      password: password,
      telefono: telefono,
      email: email,
      localidadId: localidadId
    }
  })
}

export const eliminarUsuario = async (id) => {
  const usuario = await prisma.usuarios.findUnique({
    where: { id_usuario: id }
  });
  if (!usuario) throw crearError("El usuario no existe.", 404);

  return await prisma.usuarios.delete({
    where: { id_usuario: id }
  });
}
