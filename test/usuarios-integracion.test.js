import { test, before, after, describe } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import bcrypt from "bcrypt";

assert.equal(process.env.NODE_ENV, "test");
assert.match(process.env.DATABASE_URL, /test/);

const { default: prisma } = await import("../src/config/prisma.js");
const { app } = await import("../src/app.js");

describe("Flujo de Integración: Ciclo de Vida y Gestión de Usuarios", () => {
  let localidadId;
  let rubroId;
  let adminId;
  let tokenAdmin;

  let usuarioId;
  let artesanoId;
  let solicitudId;
  let tokenUsuario;
  let tokenHabilitado;

  const datosUsuario = {
    nombre: "Sebastian",
    apellido: "Reyna",
    dni: "37111222",
    email: "seba.artesanias@gmail.com",
    telefono: "3834998877",
    password: "PasswordSeguro2026.",
    nombre_emprendimiento: "Tejidos Catamarca",
    descripcion_emprendimiento: "Producción artesanal de ponchos y mantas en telar criollo",
  };

  const adminEmail = "admin@ponchodigital.com";
  const adminPassword = "AdminPoncho2026!";

  before(async () => {
    await prisma.$connect();

    // 1. Asegurar catálogo base necesario para pruebas
    const localidad = await prisma.localidad.upsert({
      where: { nombre_locacion: "San Fernando del Valle de Catamarca" },
      update: {},
      create: { nombre_locacion: "San Fernando del Valle de Catamarca" },
    });
    localidadId = localidad.id_localidad;

    const rubro = await prisma.rubro.upsert({
      where: { nombre_rubro: "Textil" },
      update: {},
      create: { nombre_rubro: "Textil" },
    });
    rubroId = rubro.id_rubro;

    const rolAdmin = await prisma.rol.upsert({
      where: { nombre: "ADMINISTRADOR" },
      update: {},
      create: { nombre: "ADMINISTRADOR", descripcion: "Control total" },
    });

    await prisma.rol.upsert({
      where: { nombre: "ARTESANO" },
      update: {},
      create: { nombre: "ARTESANO", descripcion: "Rol de artesano" },
    });

    await prisma.rol.upsert({
      where: { nombre: "ORGANIZADOR" },
      update: {},
      create: { nombre: "ORGANIZADOR", descripcion: "Gestión de stands y logística" },
    });

    // 2. Limpiar usuarios previos de prueba para evitar colisiones
    const usuarioViejo = await prisma.usuario.findFirst({
      where: { OR: [{ email: datosUsuario.email }, { dni: datosUsuario.dni }] },
      include: { artesano: true, solicitud: true },
    });
    if (usuarioViejo) {
      if (usuarioViejo.solicitud) {
        await prisma.solicitud.delete({ where: { id_solicitud: usuarioViejo.solicitud.id_solicitud } });
      }
      if (usuarioViejo.artesano) {
        await prisma.artesano.delete({ where: { id_artesano: usuarioViejo.artesano.id_artesano } });
      }
      await prisma.usuario.delete({ where: { id_usuario: usuarioViejo.id_usuario } });
    }

    // 3. Asegurar la existencia del Administrador
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const admin = await prisma.usuario.upsert({
      where: { email: adminEmail },
      update: { activo: true },
      create: {
        nombre: "Administrador",
        apellido: "Poncho",
        dni: "11111111",
        email: adminEmail,
        telefono: "3834111111",
        passwordHash,
        rolId: rolAdmin.id_rol,
        localidadId,
        activo: true,
      },
    });
    adminId = admin.id_usuario;
  });

  after(async () => {
    await prisma.$disconnect();
  });

  // =========================================================================
  // FASE 1: REGISTRO DE USUARIO Y VALIDACIONES
  // =========================================================================
  test("[Fase 1] Error 400 Bad Request al enviar datos de registro inválidos", async () => {
    const res = await request(app)
      .post("/usuarios/registro")
      .send({
        nombre: "",
        email: "correo-invalido",
        password: "123",
      })
      .expect(400);

    assert.ok(res.body.mensaje || res.body.errores);
  });

  test("[Fase 1] 1.1 Registro exitoso de Postulante (201 Created / 200 OK)", async () => {
    const res = await request(app)
      .post("/usuarios/registro")
      .send({
        ...datosUsuario,
        localidadId,
        rubroId,
      });

    assert.ok([200, 201].includes(res.status), `Esperado 200 o 201, recibido ${res.status}`);
    assert.ok(res.body.id_usuario);
    assert.ok(res.body.artesano?.id_artesano);
    assert.ok(res.body.solicitud?.id_solicitud);

    usuarioId = res.body.id_usuario;
    artesanoId = res.body.artesano.id_artesano;
    solicitudId = res.body.solicitud.id_solicitud;
  });

  test("[Fase 1] Error 409 Conflict al registrar mismo Email ya existente", async () => {
    const res = await request(app)
      .post("/usuarios/registro")
      .send({
        nombre: "Sebastian Clon",
        apellido: "Reyna",
        dni: "39111222",
        email: datosUsuario.email,
        telefono: "3834998877",
        password: "PasswordSeguro2026.",
        localidadId,
        rubroId,
        nombre_emprendimiento: "Tejidos Catamarca 2",
        descripcion_emprendimiento: "Intento duplicado",
      })
      .expect(409);

    assert.match(res.body.mensaje, new RegExp(datosUsuario.email, "i"));
  });

  test("[Fase 1] Error 409 Conflict al registrar mismo DNI ya existente", async () => {
    const res = await request(app)
      .post("/usuarios/registro")
      .send({
        nombre: "Sebastian Clon",
        apellido: "Reyna",
        dni: datosUsuario.dni,
        email: "seba99.artesanias@gmail.com",
        telefono: "3834998877",
        password: "PasswordSeguro2026.",
        localidadId,
        rubroId,
        nombre_emprendimiento: "Tejidos Catamarca 2",
        descripcion_emprendimiento: "Intento duplicado",
      })
      .expect(409);

    assert.match(res.body.mensaje, new RegExp(datosUsuario.dni, "i"));
  });

  // =========================================================================
  // FASE 2: LOGIN, CONTEXTO DE CUENTA, AUTO-APROBACIÓN Y LOGOUT
  // =========================================================================
  test("[Fase 2] Error 401 Unauthorized al loguear con contraseña inválida", async () => {
    await request(app)
      .post("/usuarios/login")
      .send({
        email: datosUsuario.email,
        password: "PasswordIncorrecta!",
      })
      .expect(401);
  });

  test("[Fase 2] Error 401 Unauthorized al loguear con correo inexistente", async () => {
    await request(app)
      .post("/usuarios/login")
      .send({
        email: "correo.fantasma@gmail.com",
        password: datosUsuario.password,
      })
      .expect(401);
  });

  test("[Fase 2] 2.1 Login exitoso del usuario registrado (200 OK)", async () => {
    const res = await request(app)
      .post("/usuarios/login")
      .send({
        email: datosUsuario.email,
        password: datosUsuario.password,
      })
      .expect(200);

    assert.ok(res.body.token);
    tokenUsuario = res.body.token;
  });

  test("[Fase 2] 2.2 Usuario consulta su contexto autenticado (GET /usuarios/me)", async () => {
    const res = await request(app)
      .get("/usuarios/me")
      .set("Authorization", `Bearer ${tokenUsuario}`)
      .expect(200);

    const usuario = res.body.usuario || res.body;
    assert.equal(usuario.email, datosUsuario.email);
    assert.equal(usuario.activo, true);
  });

  test("[Fase 2] 2.3 Usuario consulta su solicitud y verifica estado PENDIENTE", async () => {
    const res = await request(app)
      .get("/solicitudes/me")
      .set("Authorization", `Bearer ${tokenUsuario}`)
      .expect(200);

    assert.equal(res.body.estado_solicitud, "PENDIENTE");
  });

  test("[Fase 2] Error 403 Forbidden cuando el usuario intenta auto-aprobar su solicitud", async () => {
    await request(app)
      .patch(`/solicitudes/${solicitudId}/aprobar`)
      .set("Authorization", `Bearer ${tokenUsuario}`)
      .send({
        observaciones_admin: "Intento de auto-aprobar mi postulación.",
      })
      .expect(403);
  });

  test("[Fase 2] 2.4 Cierre de sesión del usuario (POST /usuarios/logout)", async () => {
    await request(app)
      .post("/usuarios/logout")
      .set("Authorization", `Bearer ${tokenUsuario}`)
      .expect(204);
  });

  test("[Fase 2] Error 401 Unauthorized al operar con token revocado tras logout", async () => {
    await request(app)
      .get("/solicitudes/me")
      .set("Authorization", `Bearer ${tokenUsuario}`)
      .expect(401);
  });

  // =========================================================================
  // FASE 3: AUDITORÍA Y APROBACIÓN POR EL ADMINISTRADOR
  // =========================================================================
  test("[Fase 3] Login del Administrador y obtención de token", async () => {
    const res = await request(app)
      .post("/usuarios/login")
      .send({
        email: adminEmail,
        password: adminPassword,
      })
      .expect(200);

    assert.ok(res.body.token);
    tokenAdmin = res.body.token;
  });

  test("[Fase 3] 3.1 Admin lista solicitudes con filtro PENDIENTE (200 OK)", async () => {
    const res = await request(app)
      .get("/solicitudes?estado_solicitud=PENDIENTE&pagina=1&limite=10")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .expect(200);

    assert.ok(Array.isArray(res.body.solicitudes));
  });

  test("[Fase 3] Error 404 Not Found al consultar solicitud con ID inexistente", async () => {
    await request(app)
      .get("/solicitudes/99999")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .expect(404);
  });

  test("[Fase 3] 3.2 Admin consulta solicitud específica por ID (200 OK)", async () => {
    const res = await request(app)
      .get(`/solicitudes/${solicitudId}`)
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .expect(200);

    assert.equal(res.body.id_solicitud, solicitudId);
  });

  test("[Fase 3] 3.3 Admin aprueba la solicitud (200 OK)", async () => {
    const res = await request(app)
      .patch(`/solicitudes/${solicitudId}/aprobar`)
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        observaciones_admin: "Documentación validada y piezas artesanales tradicionales aprobadas.",
      })
      .expect(200);

    assert.equal(res.body.solicitud?.estado_solicitud, "APROBADO");
  });

  test("[Fase 3] Error 409 Conflict al intentar resolver solicitud ya aprobada", async () => {
    await request(app)
      .patch(`/solicitudes/${solicitudId}/rechazar`)
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        observaciones_admin: "Intento de rechazar una solicitud ya resuelta.",
      })
      .expect(409);
  });

  // =========================================================================
  // FASE 4: VERIFICACIÓN DE HABILITACIÓN DE LA CUENTA
  // =========================================================================
  test("[Fase 4] 4.1 Login del usuario con cuenta habilitada", async () => {
    const res = await request(app)
      .post("/usuarios/login")
      .send({
        email: datosUsuario.email,
        password: datosUsuario.password,
      })
      .expect(200);

    assert.ok(res.body.token);
    tokenHabilitado = res.body.token;
  });

  test("[Fase 4] 4.4 El usuario consulta su solicitud y verifica estado APROBADA", async () => {
    const res = await request(app)
      .get("/solicitudes/me")
      .set("Authorization", `Bearer ${tokenHabilitado}`)
      .expect(200);

    assert.equal(res.body.estado_solicitud, "APROBADO");
  });

  // =========================================================================
  // FASE 5: REGLAS DE NEGOCIO DE CUENTA (PROTECCIÓN ÚLTIMO ADMIN Y RBAC)
  // =========================================================================
  test("[Fase 5] Error 409 Conflict al intentar desactivar al único Admin del sistema", async () => {
    const res = await request(app)
      .patch(`/usuarios/${adminId}/activo`)
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({ activo: false })
      .expect(409);

    assert.match(res.body.mensaje, /administrador activo/i);
  });

  test("[Fase 5] Error 403 Forbidden: usuario común no puede cambiar estado activo de otro", async () => {
    await request(app)
      .patch(`/usuarios/${adminId}/activo`)
      .set("Authorization", `Bearer ${tokenHabilitado}`)
      .send({ activo: false })
      .expect(403);
  });

  // =========================================================================
  // FASE 6: ELIMINACIÓN Y EFECTOS EN CASCADA
  // =========================================================================
  test("[Fase 6] Error 403 Forbidden cuando un usuario común intenta eliminar usuarios", async () => {
    await request(app)
      .delete(`/usuarios/${usuarioId}`)
      .set("Authorization", `Bearer ${tokenHabilitado}`)
      .expect(403);
  });

  test("[Fase 6] 6.1 El Administrador elimina la cuenta del usuario (200 OK)", async () => {
    await request(app)
      .delete(`/usuarios/${usuarioId}`)
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .expect(200);
  });

  test("[Fase 6] 6.3 Verificación: el perfil del artesano fue eliminado (404 Not Found)", async () => {
    await request(app)
      .get(`/artesanos/${artesanoId}`)
      .expect(404);
  });

  test("[Fase 6] 6.4 Verificación: la solicitud fue eliminada en cascada (404 Not Found)", async () => {
    await request(app)
      .get(`/solicitudes/${solicitudId}`)
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .expect(404);
  });

  test("[Fase 6] 6.5 Verificación: el usuario ya no existe en el sistema (404 Not Found)", async () => {
    await request(app)
      .get(`/usuarios/${usuarioId}`)
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .expect(404);
  });
});
