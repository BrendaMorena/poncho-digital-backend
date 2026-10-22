import prisma from "../config/prisma.js";
import { crearError } from "../utils/errores.js";
import bcrypt from 'bcrypt'; 
import * as solicitudService from "./solicitud.service.js";


export const obtenerUsuarios = async (criteriosConsulta) => {
  const { 
    nombre, 
    apellido, 
    dni, 
    email,
    ordenarPor, 
    direccion, 
    pagina, 
    limite } = criteriosConsulta;

  const where = {};
  
  if (nombre !== undefined) {
    where.nombre = {
      contains: nombre,
      mode: "insensitive",
    };
  }
  if (apellido !== undefined) {
    where.apellido = {
      contains: apellido,
      mode: "insensitive",
    };
  }
  if (email !== undefined) {
    where.email = {
      contains: email,
      mode: "insensitive",
    };
  }
  if (dni !== undefined) {
    where.dni = {
      contains: dni, 
    };
  }
  
  const orderBy = [{ [ordenarPor]: direccion }, { id_usuario: "asc" }];
  
  const selectLista = {
        id_usuario: true,
        nombre: true,
        apellido: true,
        email: true,
        rol: {
          select: {
            nombre: true,
          },
        },
      }

  const desplazamiento = (pagina - 1) * limite;

const [usuarios, total] = await prisma.$transaction([
    prisma.usuario.findMany({
      where,
      orderBy,
      select: selectLista,
      skip: desplazamiento,
      take: limite,
    }),
    prisma.usuario.count({ where }),
  ]);

  return {
    usuarios,
    paginacion: {
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite)
    }
  };
};

export const obtenerUsuarioPorId = async (id) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: id },
    select: {
      id_usuario: true,
      nombre: true,
      apellido: true,
      email: true,
      activo: true, 
      rol: {
        select: {
          nombre: true,
        },
      },
      solicitud: {
        select: {
          id_solicitud: true,
          estado_solicitud: true,
        },
      },
      artesano: {
        select: {
          id_artesano: true,
          estado: true,
        },
      },
    },
  });
  if (!usuario) return null;
  return {
    ...usuario,
    rol: usuario.rol?.nombre,
  };
};


export const crearUsuario = async (crearUsuarioDto) => {
  const { 
    nombre, 
    apellido, 
    dni, 
    password, 
    telefono, 
    email, 
    localidadId, 
    rolId 
  } = crearUsuarioDto;
    
  const emailExiste = await prisma.usuario.findUnique({ where: { email } });
  if (emailExiste) throw crearError(`El correo ${email} ya está registrado`, 409);

  if (dni) {
    const dniExiste = await prisma.usuario.findUnique({ where: { dni } });
    if (dniExiste) throw crearError(`El DNI ${dni} ya está registrado`, 409);
  }

  const rolExiste = await prisma.rol.findUnique({ where: { id_rol: rolId } });
  if (!rolExiste) throw crearError(`No existe un rol con id ${rolId}`, 404);

  const localidadExiste = await prisma.localidad.findUnique({ where: { id_localidad: localidadId } });
  if (!localidadExiste) throw crearError(`No existe una localidad con id ${localidadId}`, 404);

  // Encriptamos la clave
  const passwordHash = await bcrypt.hash(password, 10);

  const nuevoUsuario = await prisma.usuario.create({
    data: {
      nombre,
      apellido,
      dni,
      passwordHash,
      telefono,
      email,
      localidadId,
      rolId,
    }, select: {
      id_usuario: true,
      nombre: true,
      apellido: true,
      dni: true,
      email: true,
      localidadId: true
    }
  });

  return nuevoUsuario;
};

export const actualizarUsuario = async (id, actualizarUsuarioDto) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: id }
  });
  if (!usuario) throw crearError("El usuario no existe.", 404); 

  const { nombre, apellido, dni, password, telefono, email, localidadId } = actualizarUsuarioDto;

  if (dni && dni !== usuario.dni) {
    const dniExiste = await prisma.usuario.findUnique({ where: { dni } });
    if (dniExiste) throw crearError(`El DNI ${dni} ya está registrado`, 409);
  }

  let passwordHash;
  if (password) {
    passwordHash = await bcrypt.hash(password, 10);
  }

  return await prisma.usuario.update({
    where: { id_usuario: id },
    data: {
      nombre,
      apellido,
      dni,
      passwordHash,
      telefono,
      email,
      localidadId
    } 
  });
};

export const eliminarUsuario = async (id) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: id }
  });
  if (!usuario) throw crearError("El usuario no existe.", 404);

  return await prisma.usuario.delete({
    where: { id_usuario: id }
  });
}

const existeAtributo = (modelo, atributo) => async (valor) =>{
  if(!valor) return
  const resultado = await prisma[modelo].findUnique({where: {[atributo]: valor}})
  if(resultado) throw crearError(`El ${atributo} '${valor}' ya existe en el sistema`, 409)
}

const existeEmailUsuario = existeAtributo("usuario", "email")
const existeDniUsuario = existeAtributo("usuario", "dni")

const FACTOR_COSTO = 10

export const registrarUsuario = async (registrarUsuarioDTO) => {
  const {nombre, apellido, dni, email, telefono, password, localidadId} = registrarUsuarioDTO
  await existeEmailUsuario(email)
  await existeDniUsuario(dni)

  const localidadExiste = await prisma.localidad.findUnique({
    where: { id_localidad: localidadId }
  });
  if (!localidadExiste) {
    throw crearError(`No existe una localidad con id ${localidadId}`, 404);
  }

  const rolArtesano = await prisma.rol.findFirst({
    where: { nombre: { contains: "artesano", mode: "insensitive" } },
  });
  if (!rolArtesano) {
    throw crearError("No se encontró el rol de artesano configurado en el sistema", 500);
  }

  const passwordHash = await bcrypt.hash(password, FACTOR_COSTO)

  return prisma.$transaction(async (tx) => {

    const nuevoUsuario = await tx.usuario.create({
      data: {
        nombre,
        apellido,
        dni,
        email,
        telefono,
        passwordHash,
        activo: true,
        rolId: rolArtesano.id_rol,
        localidadId,
      },
      select: {
        id_usuario: true,
        nombre: true,
        apellido: true,
        activo: true,
        createdAt: true
      }
    })
    
    const nuevoSolicitudDTO = {
      usuarioId: nuevoUsuario.id_usuario,
      rubroId: registrarUsuarioDTO.rubroId,
      nombre_emprendimiento: registrarUsuarioDTO.nombre_emprendimiento,
      descripcion_emprendimiento: registrarUsuarioDTO.descripcion_emprendimiento,
    };

    const nuevaSolicitud = await solicitudService.crearSolicitud(nuevoSolicitudDTO, tx)

    return {...nuevoUsuario, solicitud: nuevaSolicitud}
  })
}

export const iniciarSesion = async (iniciarSesionDTO) => {
  const { email, password } = iniciarSesionDTO;

  const usuarioEncontrado = await prisma.usuario.findUnique({
    where: { email },
    include: {
      rol: true
    }
  });

  if (!usuarioEncontrado) {
    throw crearError("Las credenciales son inválidas.", 401);
  }

  const passwordValida = await bcrypt.compare(
    password,
    usuarioEncontrado.passwordHash
  );

  if (!passwordValida || !usuarioEncontrado.activo) {
    throw crearError("Las credenciales son inválidas.", 401);
  }

  return {
    id_usuario: usuarioEncontrado.id_usuario,
    nombre: usuarioEncontrado.nombre,
    apellido: usuarioEncontrado.apellido,
    // email: usuarioEncontrado.email,
  };
};

// export const cambiarActivo = async (usuarioId, activo) => {
//   return await prisma.$transaction(async (tx) => {
//     const usuario = await tx.usuario.findUnique({
//       where: { id_usuario: usuarioId },
//       include: { rol: true },
//     });
//     if (!usuario) {
//       throw crearError("El usuario no existe.", 404);
//     }
//     if (activo === false && usuario.rol?.nombre === "ADMINISTRADOR") {
//       const otrosAdminsActivos = await tx.usuario.count({
//         where: {
//           rol: { nombre: "ADMINISTRADOR" },
//           activo: true,
//           id_usuario: { not: usuarioId }, 
//         },
//       });
//       if (otrosAdminsActivos === 0) {
//         throw crearError("Debe quedar un administrador activo.", 409);
//       }
//     }
//     return await tx.usuario.update({
//       where: { id_usuario: usuarioId },
//       data: { activo },
//       select: {
//         id_usuario: true,
//         nombre: true,
//         apellido: true,
//         email: true,
//         activo: true,
//         rol: {
//           select: {
//             nombre: true,
//           },
//         },
//       },
//     });
//   });
// };