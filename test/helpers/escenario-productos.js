import request from "supertest";
import bcrypt from "bcrypt";

export async function crearEscenario(app, prisma) {
  const password = "PasswordSeguro2026!";

  // 1. Catálogo mínimo requerido
  const rubro = await prisma.rubro.upsert({
    where: { nombre_rubro: "Textil" },
    update: {},
    create: { nombre_rubro: "Textil" },
  });

  const localidad = await prisma.localidad.upsert({
    where: { nombre_locacion: "San Fernando del Valle de Catamarca" },
    update: {},
    create: { nombre_locacion: "San Fernando del Valle de Catamarca" },
  });

  await prisma.rol.upsert({
    where: { nombre: "ARTESANO" },
    update: {},
    create: { nombre: "ARTESANO", descripcion: "Rol de artesano" },
  });

  // 2. Función para registrar un artesano habilitado vía API
  const registrarArtesano = async (nombre, orden) => {
    const sufijo = Date.now() + orden;
    const email = `${nombre.toLowerCase()}.${sufijo}@test.com`;
    const dni = String(40000000 + orden + Math.floor(Math.random() * 1000));

    // Registro público (Crea Usuario + Artesano INACTIVO + Solicitud PENDIENTE)
    const { body: registro } = await request(app)
      .post("/usuarios/registro")
      .send({
        nombre,
        apellido: "Test",
        dni,
        email,
        telefono: "3834112233",
        password,
        localidadId: localidad.id_localidad,
        rubroId: rubro.id_rubro,
        nombre_emprendimiento: `Emprendimiento ${nombre}`,
        descripcion_emprendimiento: "Artesanías tradicionales de vicuña",
      })
      .expect(201);

    // Habilitar directamente en la base de pruebas para que quede como ARTESANO ACTIVO
    const artesano = await prisma.artesano.update({
      where: { id_artesano: registro.artesano.id_artesano },
      data: { estado: "ACTIVO" },
    });

    await prisma.solicitud.update({
      where: { id_solicitud: registro.solicitud.id_solicitud },
      data: { estado_solicitud: "APROBADO" },
    });

    // Iniciar sesión para obtener el token JWT
    const { body: login } = await request(app)
      .post("/usuarios/login")
      .send({ email, password })
      .expect(200);

    return {
      usuario: registro,
      artesano,
      token: login.token,
    };
  };

  const ana = await registrarArtesano("Ana", 1);
  const bruno = await registrarArtesano("Bruno", 2);

  const rolAdmin = await prisma.rol.upsert({
    where: { nombre: "ADMINISTRADOR" },
    update: {},
    create: { nombre: "ADMINISTRADOR", descripcion: "Acceso total" },
  });

  // Creamos un usuario administrador directamente en la base
  const passwordHash = await bcrypt.hash(password, 10);
  const usuarioAdmin = await prisma.usuario.create({
    data: {
      nombre: "Admin",
      apellido: "Test",
      dni: String(90000000 + Math.floor(Math.random() * 1000000)),
      email: `admin.${Date.now()}@test.com`,
      telefono: "3834999999",
      passwordHash,
      activo: true,
      localidadId: localidad.id_localidad,
      rolId: rolAdmin.id_rol,
    },
  });

  // Iniciamos sesión como Admin para obtener su token
  const { body: loginAdmin } = await request(app)
    .post("/usuarios/login")
    .send({ email: usuarioAdmin.email, password })
    .expect(200);

  const admin = {
    usuario: usuarioAdmin,
    token: loginAdmin.token,
  };

  return { ana, bruno, admin, rubro };
}
