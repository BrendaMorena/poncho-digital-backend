import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import bcrypt from "bcrypt";

assert.equal(process.env.NODE_ENV, "test");
assert.match(process.env.DATABASE_URL, /test/);

const { default: prisma } = await import("../src/config/prisma.js");
const { app } = await import("../src/app.js");

// Estado compartido a lo largo de los pasos del flujo de stands
const estado = {
  rubros: {},
  sectores: {},
  localidadId: null,
  pabellonId: null,
  tokenAdmin: null,
  artesanoA: { usuarioId: null, artesanoId: null, solicitudId: null, token: null },
  artesanoB: { usuarioId: null, artesanoId: null, solicitudId: null, token: null },
  artesanoC: { usuarioId: null, artesanoId: null, solicitudId: null, token: null },
  artesanoD: { usuarioId: null, artesanoId: null, solicitudId: null, token: null },
  stand101Id: null,
  stand102Id: null,
  stand201Id: null,
  stand301Id: null,
};

before(async () => {
  await prisma.$connect();

  // Limpieza en orden estricto de claves foráneas
  await prisma.$transaction([
    prisma.producto.deleteMany(),
    prisma.solicitud.deleteMany(),
    prisma.stand.deleteMany(),
    prisma.artesano.deleteMany(),
    prisma.tokenRevocado.deleteMany(),
    prisma.busqueda.deleteMany(),
    prisma.usuario.deleteMany(),
    prisma.sector.deleteMany(),
    prisma.pabellon.deleteMany(),
  ]);

  // 1. Roles requeridos
  const rolAdmin = await prisma.rol.upsert({
    where: { nombre: "ADMINISTRADOR" },
    update: {},
    create: { nombre: "ADMINISTRADOR", descripcion: "Acceso total" },
  });

  await prisma.rol.upsert({
    where: { nombre: "ORGANIZADOR" },
    update: {},
    create: { nombre: "ORGANIZADOR", descripcion: "Gestor del predio" },
  });

  await prisma.rol.upsert({
    where: { nombre: "ARTESANO" },
    update: {},
    create: { nombre: "ARTESANO", descripcion: "Postulante y artesano" },
  });

  // 2. Localidad
  const localidad = await prisma.localidad.upsert({
    where: { nombre_locacion: "San Fernando del Valle de Catamarca" },
    update: {},
    create: { nombre_locacion: "San Fernando del Valle de Catamarca" },
  });
  estado.localidadId = localidad.id_localidad;

  // 3. Rubros
  const rTextil = await prisma.rubro.upsert({
    where: { nombre_rubro: "Textil" },
    update: {},
    create: { nombre_rubro: "Textil" },
  });
  const rCeramica = await prisma.rubro.upsert({
    where: { nombre_rubro: "Cerámica" },
    update: {},
    create: { nombre_rubro: "Cerámica" },
  });
  const rMadera = await prisma.rubro.upsert({
    where: { nombre_rubro: "Madera" },
    update: {},
    create: { nombre_rubro: "Madera" },
  });

  estado.rubros = {
    textil: rTextil.id_rubro,
    ceramica: rCeramica.id_rubro,
    madera: rMadera.id_rubro,
  };

  // 4. Pabellón
  const pabellon = await prisma.pabellon.create({
    data: {
      nombre_pabellon: "Pabellón Central",
      descripcion_pabellon: "Espacio principal de exposición artesanal",
    },
  });
  estado.pabellonId = pabellon.id_pabellon;

  // 5. Sectores vinculados a Rubros y Pabellón
  const secTextil = await prisma.sector.create({
    data: {
      codigo_sector: "SEC-TEXTIL",
      nombre_sector: "Sector Textil",
      pabellonId: estado.pabellonId,
      rubroId: estado.rubros.textil,
    },
  });

  const secCeramica = await prisma.sector.create({
    data: {
      codigo_sector: "SEC-CERAMICA",
      nombre_sector: "Sector Cerámica",
      pabellonId: estado.pabellonId,
      rubroId: estado.rubros.ceramica,
    },
  });

  estado.sectores = {
    textil: secTextil.id_sector,
    ceramica: secCeramica.id_sector,
  };

  // 6. Stands iniciales en el predio
  const stand101 = await prisma.stand.create({
    data: {
      numero_stand: 101,
      coordenada: { lat: -28.4681, lng: -65.7791 },
      sectorId: estado.sectores.textil,
      estado: "DISPONIBLE",
    },
  });

  const stand102 = await prisma.stand.create({
    data: {
      numero_stand: 102,
      coordenada: { lat: -28.4682, lng: -65.7792 },
      sectorId: estado.sectores.textil,
      estado: "DISPONIBLE",
    },
  });

  const stand201 = await prisma.stand.create({
    data: {
      numero_stand: 201,
      coordenada: { lat: -28.4691, lng: -65.7801 },
      sectorId: estado.sectores.ceramica,
      estado: "DISPONIBLE",
    },
  });

  const stand301 = await prisma.stand.create({
    data: {
      numero_stand: 301,
      coordenada: { lat: -28.4701, lng: -65.7811 },
      sectorId: estado.sectores.textil,
      estado: "MANTENIMIENTO",
    },
  });

  estado.stand101Id = stand101.id_stand;
  estado.stand102Id = stand102.id_stand;
  estado.stand201Id = stand201.id_stand;
  estado.stand301Id = stand301.id_stand;

  // 7. Cuenta de Administrador del predio
  await prisma.usuario.create({
    data: {
      nombre: "Administrador",
      apellido: "Poncho",
      dni: "11111111",
      email: "admin@ponchodigital.com",
      telefono: "3834111111",
      passwordHash: await bcrypt.hash("AdminPoncho2026!", 10),
      activo: true,
      rolId: rolAdmin.id_rol,
      localidadId: localidad.id_localidad,
    },
  });
});

after(async () => {
  await prisma.$disconnect();
});

// ===========================================================================
// PASO 0: Postulación de 3 Artesanos y habilitación de Artesanos A y B
// ===========================================================================
test("Paso 0: Registro de 3 postulantes, login Admin y aprobación de solicitudes para habilitar Artesanos A y B", async () => {
  // 0.1 Registro Artesano A (Textil)
  const resA = await request(app)
    .post("/usuarios/registro")
    .send({
      nombre: "Lucas",
      apellido: "Tejedor",
      dni: "38111222",
      email: "lucas.tejedor@ponchodigital.com",
      telefono: "3834111222",
      password: "Artesano2026!",
      localidadId: estado.localidadId,
      rubroId: estado.rubros.textil,
      nombre_emprendimiento: "Telares Belichos",
      descripcion_emprendimiento: "Tejidos tradicionales en fibra de vicuña y oveja",
    })
    .expect(201);

  estado.artesanoA.usuarioId = resA.body.id_usuario;
  estado.artesanoA.artesanoId = resA.body.artesano.id_artesano;
  estado.artesanoA.solicitudId = resA.body.solicitud.id_solicitud;

  // 0.2 Registro Artesano B (Textil)
  const resB = await request(app)
    .post("/usuarios/registro")
    .send({
      nombre: "Marcos",
      apellido: "Hilandero",
      dni: "38222333",
      email: "marcos.hilandero@ponchodigital.com",
      telefono: "3834222333",
      password: "Artesano2026!",
      localidadId: estado.localidadId,
      rubroId: estado.rubros.textil,
      nombre_emprendimiento: "Ponchos del Valle",
      descripcion_emprendimiento: "Prendas autóctonas artesanales tejidas a mano",
    })
    .expect(201);

  estado.artesanoB.usuarioId = resB.body.id_usuario;
  estado.artesanoB.artesanoId = resB.body.artesano.id_artesano;
  estado.artesanoB.solicitudId = resB.body.solicitud.id_solicitud;

  // 0.3 Registro Artesano C (Madera - Quedará PENDIENTE / INACTIVO para pruebas negativas)
  const resC = await request(app)
    .post("/usuarios/registro")
    .send({
      nombre: "Pedro",
      apellido: "Postulante",
      dni: "38333444",
      email: "pedro.pendiente@ponchodigital.com",
      telefono: "3834333444",
      password: "Artesano2026!",
      localidadId: estado.localidadId,
      rubroId: estado.rubros.madera,
      nombre_emprendimiento: "Maderas del Valle",
      descripcion_emprendimiento: "Tallado artesanal en algarrobo",
    })
    .expect(201);

  estado.artesanoC.usuarioId = resC.body.id_usuario;
  estado.artesanoC.artesanoId = resC.body.artesano.id_artesano;
  estado.artesanoC.solicitudId = resC.body.solicitud.id_solicitud;

  // 0.4 Login Admin
  const loginAdmin = await request(app)
    .post("/usuarios/login")
    .send({ email: "admin@ponchodigital.com", password: "AdminPoncho2026!" })
    .expect(200);

  estado.tokenAdmin = loginAdmin.body.token;

  // 0.5 Aprobar solicitudes de Artesanos A y B (pasan a ACTIVO)
  const aprobA = await request(app)
    .patch(`/solicitudes/${estado.artesanoA.solicitudId}/aprobar`)
    .set("Authorization", `Bearer ${estado.tokenAdmin}`)
    .send({ observaciones_admin: "Habilitado para asignación de stand." })
    .expect(200);

  assert.equal(aprobA.body.artesano.estado, "ACTIVO");

  const aprobB = await request(app)
    .patch(`/solicitudes/${estado.artesanoB.solicitudId}/aprobar`)
    .set("Authorization", `Bearer ${estado.tokenAdmin}`)
    .send({ observaciones_admin: "Habilitado para asignación de stand." })
    .expect(200);

  assert.equal(aprobB.body.artesano.estado, "ACTIVO");
});

// ===========================================================================
// PASO 1: Catálogo público de stands (200), consulta por ID y validación (400 / 404)
// ===========================================================================
test("Paso 1: Catálogo público de stands (200), filtro por estado, detalle por ID (200) y rechazos por ID (400 / 404)", async () => {
  // 1.1 Listado público de stands disponibles
  const catalogo = await request(app)
    .get("/stands?estado=DISPONIBLE&pagina=1&limite=10")
    .expect(200);

  assert.ok(Array.isArray(catalogo.body.stands));
  assert.equal(catalogo.body.stands.length, 3); // 101, 102, 201

  // 1.2 Detalle por ID válido
  const detalle = await request(app)
    .get(`/stands/${estado.stand101Id}`)
    .expect(200);

  assert.equal(detalle.body.numero_stand, 101);
  assert.equal(detalle.body.estado, "DISPONIBLE");
  assert.equal(detalle.body.artesano, null);

  // 1.3 Error 404: Stand inexistente
  await request(app).get("/stands/999999").expect(404);

  // 1.4 Error 400: ID no numérico
  await request(app).get("/stands/id-invalido").expect(400);
});

// ===========================================================================
// PASO 2: Perspectiva Artesano previa a asignación (GET /artesanos/me y 403)
// ===========================================================================
test("Paso 2: Login Artesano A, verificación stand null en /artesanos/me (200) y rechazo 403 en autoasignación y liberación", async () => {
  const loginA = await request(app)
    .post("/usuarios/login")
    .send({ email: "lucas.tejedor@ponchodigital.com", password: "Artesano2026!" })
    .expect(200);

  estado.artesanoA.token = loginA.body.token;

  // 2.1 Artesano A consulta su perfil propio antes de tener stand
  const perfilA = await request(app)
    .get("/artesanos/me")
    .set("Authorization", `Bearer ${estado.artesanoA.token}`)
    .expect(200);

  assert.equal(perfilA.body.stand, null);

  // 2.2 Error 403: Artesano intenta autoasignarse un stand
  const intentoAsignar = await request(app)
    .post("/stands/asignar")
    .set("Authorization", `Bearer ${estado.artesanoA.token}`)
    .send({
      artesanoId: estado.artesanoA.artesanoId,
      standId: estado.stand101Id,
    })
    .expect(403);

  assert.equal(intentoAsignar.body.error, "Acceso denegado: no posee los permisos requeridos.");

  // 2.3 Error 403: Artesano intenta liberar un stand
  const intentoLiberar = await request(app)
    .patch(`/stands/${estado.stand101Id}/liberar`)
    .set("Authorization", `Bearer ${estado.artesanoA.token}`)
    .expect(403);

  assert.equal(intentoLiberar.body.error, "Acceso denegado: no posee los permisos requeridos.");

  // 2.4 Error 401: Petición sin token de autenticación
  await request(app)
    .post("/stands/asignar")
    .send({ artesanoId: estado.artesanoA.artesanoId })
    .expect(401);
});

// ===========================================================================
// PASO 3: Validaciones y errores de asignación como Admin (400 / 404)
// ===========================================================================
test("Paso 3: Validaciones de asignación como Admin: body vacío (400), artesano inexistente (404), stand inexistente (404) y artesano inactivo (400)", async () => {
  // 3.1 Error 400: Body vacío
  await request(app)
    .post("/stands/asignar")
    .set("Authorization", `Bearer ${estado.tokenAdmin}`)
    .send({})
    .expect(400);

  // 3.2 Error 404: Artesano inexistente
  const artesanoInexistente = await request(app)
    .post("/stands/asignar")
    .set("Authorization", `Bearer ${estado.tokenAdmin}`)
    .send({ artesanoId: 999999, standId: estado.stand101Id })
    .expect(404);

  assert.equal(artesanoInexistente.body.error, "No existe un artesano con id 999999");

  // 3.3 Error 404: Stand inexistente
  const standInexistente = await request(app)
    .post("/stands/asignar")
    .set("Authorization", `Bearer ${estado.tokenAdmin}`)
    .send({ artesanoId: estado.artesanoA.artesanoId, standId: 999999 })
    .expect(404);

  assert.equal(standInexistente.body.error, "No existe un stand con id 999999");

  // 3.4 Error 400: Artesano no activo (Artesano C sigue INACTIVO porque su solicitud no fue aprobada)
  const inactivo = await request(app)
    .post("/stands/asignar")
    .set("Authorization", `Bearer ${estado.tokenAdmin}`)
    .send({ artesanoId: estado.artesanoC.artesanoId, standId: estado.stand101Id })
    .expect(400);

  assert.match(inactivo.body.error, /Solo se puede asignar un stand a artesanos en estado ACTIVO/);
});

// ===========================================================================
// PASO 4: Asignación manual exitosa (200) y conflictos de reasignación / ocupación (409)
// ===========================================================================
test("Paso 4: Asignación manual exitosa Stand 101 a Artesano A (200), conflicto por reasignación (409) y stand ya ocupado (409)", async () => {
  // 4.1 Asignación manual de Stand 101 a Artesano A
  const asignacion = await request(app)
    .post("/stands/asignar")
    .set("Authorization", `Bearer ${estado.tokenAdmin}`)
    .send({
      artesanoId: estado.artesanoA.artesanoId,
      standId: estado.stand101Id,
    })
    .expect(200);

  assert.equal(asignacion.body.numero_stand, 101);
  assert.equal(asignacion.body.estado, "OCUPADO");
  assert.equal(asignacion.body.artesano.id_artesano, estado.artesanoA.artesanoId);
  assert.equal(asignacion.body.artesano.nombre_emprendimiento, "Telares Belichos");

  // 4.2 Conflicto 409: Intentar reasignar otro stand (102) a Artesano A que ya tiene stand asignado
  const conflictoReasignacion = await request(app)
    .post("/stands/asignar")
    .set("Authorization", `Bearer ${estado.tokenAdmin}`)
    .send({
      artesanoId: estado.artesanoA.artesanoId,
      standId: estado.stand102Id,
    })
    .expect(409);

  assert.match(conflictoReasignacion.body.error, /ya tiene asignado el stand número '101'/);

  // 4.3 Conflicto 409: Intentar asignar el Stand 101 (ya ocupado) a Artesano B
  const conflictoOcupado = await request(app)
    .post("/stands/asignar")
    .set("Authorization", `Bearer ${estado.tokenAdmin}`)
    .send({
      artesanoId: estado.artesanoB.artesanoId,
      standId: estado.stand101Id,
    })
    .expect(409);

  assert.match(conflictoOcupado.body.error, /no está disponible/);

  // 4.4 Conflicto 409: Intentar asignar Stand 301 (en MANTENIMIENTO)
  const conflictoMantenimiento = await request(app)
    .post("/stands/asignar")
    .set("Authorization", `Bearer ${estado.tokenAdmin}`)
    .send({
      artesanoId: estado.artesanoB.artesanoId,
      standId: estado.stand301Id,
    })
    .expect(409);

  assert.match(conflictoMantenimiento.body.error, /no está disponible \(estado actual: MANTENIMIENTO\)/);
});

// ===========================================================================
// PASO 5: Asignación automática por rubro (200) y rechazo por cupos agotados (409)
// ===========================================================================
test("Paso 5: Asignación automática por rubro a Artesano B (200) y conflicto 409 por agotamiento de cupos", async () => {
  // 5.1 Asignación automática: Artesano B (Textil) sin indicar standId
  // Debe encontrar automáticamente el Stand 102 (disponible en Sector Textil)
  const auto = await request(app)
    .post("/stands/asignar")
    .set("Authorization", `Bearer ${estado.tokenAdmin}`)
    .send({ artesanoId: estado.artesanoB.artesanoId })
    .expect(200);

  assert.equal(auto.body.numero_stand, 102);
  assert.equal(auto.body.estado, "OCUPADO");
  assert.equal(auto.body.artesano.id_artesano, estado.artesanoB.artesanoId);

  // 5.2 Registro y habilitación de Artesano D (también de Rubro Textil)
  const resD = await request(app)
    .post("/usuarios/registro")
    .send({
      nombre: "Clara",
      apellido: "Rivadavia",
      dni: "38999000",
      email: "clara.textil@ponchodigital.com",
      telefono: "3834999000",
      password: "Artesano2026!",
      localidadId: estado.localidadId,
      rubroId: estado.rubros.textil,
      nombre_emprendimiento: "Hilados Catamarqueños",
      descripcion_emprendimiento: "Mantas y tejidos en telar criollo",
    })
    .expect(201);

  estado.artesanoD.artesanoId = resD.body.artesano.id_artesano;

  await request(app)
    .patch(`/solicitudes/${resD.body.solicitud.id_solicitud}/aprobar`)
    .set("Authorization", `Bearer ${estado.tokenAdmin}`)
    .send({ observaciones_admin: "Aprobada." })
    .expect(200);

  // 5.3 Conflicto 409: Asignación automática para Artesano D falla porque
  // ya no quedan stands disponibles en Sector Textil (101 y 102 ocupados, 301 en mantenimiento)
  const sinCupo = await request(app)
    .post("/stands/asignar")
    .set("Authorization", `Bearer ${estado.tokenAdmin}`)
    .send({ artesanoId: estado.artesanoD.artesanoId })
    .expect(409);

  assert.match(sinCupo.body.error, /No hay stands disponibles en el predio para el rubro del artesano/);
});

// ===========================================================================
// PASO 6: Perspectiva Artesano post-asignación (GET /artesanos/me y catálogo)
// ===========================================================================
test("Paso 6: Verificación de stand asignado en GET /artesanos/me de Artesano A (200), Artesano B (200) y catálogo público", async () => {
  // 6.1 Artesano A consulta su perfil y constata su Stand 101
  const perfilA = await request(app)
    .get("/artesanos/me")
    .set("Authorization", `Bearer ${estado.artesanoA.token}`)
    .expect(200);

  assert.notEqual(perfilA.body.stand, null);
  assert.equal(perfilA.body.stand.numero_stand, 101);
  assert.equal(perfilA.body.stand.sector.nombre_sector, "Sector Textil");
  assert.equal(perfilA.body.stand.sector.pabellon.nombre_pabellon, "Pabellón Central");

  // 6.2 Login y consulta de Artesano B
  const loginB = await request(app)
    .post("/usuarios/login")
    .send({ email: "marcos.hilandero@ponchodigital.com", password: "Artesano2026!" })
    .expect(200);

  estado.artesanoB.token = loginB.body.token;

  const perfilB = await request(app)
    .get("/artesanos/me")
    .set("Authorization", `Bearer ${estado.artesanoB.token}`)
    .expect(200);

  assert.notEqual(perfilB.body.stand, null);
  assert.equal(perfilB.body.stand.numero_stand, 102);

  // 6.3 Consulta pública del stand para verificar visualización en catálogo/mapa
  const standPublico = await request(app)
    .get(`/stands/${estado.stand101Id}`)
    .expect(200);

  assert.equal(standPublico.body.estado, "OCUPADO");
  assert.equal(standPublico.body.artesano.nombre_emprendimiento, "Telares Belichos");
});

// ===========================================================================
// PASO 7: Liberación de stand por Admin (200), errores (400 / 404) y actualización en Artesano
// ===========================================================================
test("Paso 7: Liberar stand ya disponible (400), stand inexistente (404), liberación exitosa Stand 101 (200), retorno a null en /artesanos/me y reasignación de cupo liberado", async () => {
  // 7.1 Error 400: Intentar liberar Stand 201 que ya está disponible y sin artesano
  const liberarDisponible = await request(app)
    .patch(`/stands/${estado.stand201Id}/liberar`)
    .set("Authorization", `Bearer ${estado.tokenAdmin}`)
    .expect(400);

  assert.match(liberarDisponible.body.error, /ya se encuentra disponible y sin artesano asignado/);

  // 7.2 Error 404: Intentar liberar stand inexistente
  await request(app)
    .patch("/stands/999999/liberar")
    .set("Authorization", `Bearer ${estado.tokenAdmin}`)
    .expect(404);

  // 7.3 Liberación exitosa de Stand 101 por Admin
  const liberado = await request(app)
    .patch(`/stands/${estado.stand101Id}/liberar`)
    .set("Authorization", `Bearer ${estado.tokenAdmin}`)
    .expect(200);

  assert.equal(liberado.body.numero_stand, 101);
  assert.equal(liberado.body.estado, "DISPONIBLE");
  assert.equal(liberado.body.artesanoId, null);

  // 7.4 Verificación en Artesano A: su stand volvió automáticamente a null
  const perfilPostLiberacion = await request(app)
    .get("/artesanos/me")
    .set("Authorization", `Bearer ${estado.artesanoA.token}`)
    .expect(200);

  assert.equal(perfilPostLiberacion.body.stand, null);

  // 7.5 Reutilización de cupo: Ahora que el Stand 101 quedó libre, Artesano D puede recibirlo automáticamente
  const reasignado = await request(app)
    .post("/stands/asignar")
    .set("Authorization", `Bearer ${estado.tokenAdmin}`)
    .send({ artesanoId: estado.artesanoD.artesanoId })
    .expect(200);

  assert.equal(reasignado.body.numero_stand, 101);
  assert.equal(reasignado.body.estado, "OCUPADO");
  assert.equal(reasignado.body.artesano.id_artesano, estado.artesanoD.artesanoId);
});
