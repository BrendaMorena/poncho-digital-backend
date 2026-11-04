import request from "supertest";

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

  return { ana, bruno, rubro };
}
