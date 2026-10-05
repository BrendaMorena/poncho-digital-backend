import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";
import bcrypt from 'bcrypt'; 
import * as solicitudService from "./solicitud.service.js";

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

export const registrarArtesano = async (datosRegistro) => {
  const { nombre, apellido, email, password, telefono, localidadId, rubroId, descripcion_emprendimiento, } = datosRegistro;
  // Validamos que el email no exista
  const emailExiste = await prisma.usuario.findUnique({ where: { email } });
  if (emailExiste) {
    throw crearError(`El correo ${email} ya está registrado`, 409);
  }
  // Buscamos el ID del rol de artesano dinámicamente
  const rolArtesano = await prisma.rol.findFirst({
    where: { nombre: { contains: "artesano", mode: "insensitive" } },
  });
  if (!rolArtesano) {
    throw crearError("No se encontró el rol de artesano configurado en el sistema", 500);
  }
  
  const passwordHash = await bcrypt.hash(password, 10);
  // Orquestamos la creación en una sola transacción atómica
  return prisma.$transaction(async (tx) => {
    
    // A) Se crea la cuenta
    const nuevoUsuario = await tx.usuario.create({
      data: {
        nombre,
        apellido,
        email,
        password: passwordHash, 
        telefono,
        localidadId,
        rolId: rolArtesano.id_rol,
      },
      include: { rol: true, localidad: true },
    });
    // B) Se pide a Solicitud que cree el trámite enlazado
    const nuevaSolicitud = await solicitudService.crearSolicitud({
      usuarioId: nuevoUsuario.id_usuario,
      rubroId,
      descripcion_emprendimiento,
    }, tx); 
    return {
      usuario: nuevoUsuario,
      solicitud: nuevaSolicitud,
    };
  });
};

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
