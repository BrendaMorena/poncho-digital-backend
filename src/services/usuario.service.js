import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";
import bcrypt from 'bcrypt'; 


export const obtenerUsuarios = async (page, limit, sortBy, sortOrder) => {
  const skip = (page - 1) * limit;
  // Creamos un "diccionario" con todas las opciones posibles de ordenamiento
  const opcionesOrden = {
    nombre: { nombre: sortOrder },
    apellido: { apellido: sortOrder },
    email: { email: sortOrder }
  };
  const usuarios = await prisma.usuario.findMany({
    skip: skip,
    take: limit,
    orderBy: opcionesOrden[sortBy],
    include: {
      localidad: true
    }
 });
  const totalUsuarios= await prisma.usuario.count();

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
  return await prisma.usuario.findUnique({
    where: { id_usuario: id },
    include: {
      localidad: true 
    }
  });
}

export const crearUsuario = async (crearUsuarioDto) => {
  const { nombre, apellido, password, telefono, email, localidadId } = crearUsuarioDto;
  
  // Encriptamos la clave
  const passwordHash = await bcrypt.hash(password, 10);

  
  return await prisma.usuario.create({
    data:{
      nombre: nombre,
      apellido: apellido,
      password: passwordHash, // hash
      telefono: telefono,
      email: email,
      localidadId: localidadId,
      rolId: 3
    }
  });
};

export const actualizarUsuario = async (id, actualizarUsuarioDto) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: id }
  });
  if (!usuario) throw crearError("El usuario no existe.", 404); 

  const { nombre, apellido, password, telefono, email, localidadId } = actualizarUsuarioDto;

  return await prisma.usuario.update({
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
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: id }
  });
  if (!usuario) throw crearError("El usuario no existe.", 404);

  return await prisma.usuario.delete({
    where: { id_usuario: id }
  });
}
