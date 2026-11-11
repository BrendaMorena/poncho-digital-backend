import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import bcrypt from "bcrypt";

assert.equal(process.env.NODE_ENV, "test");
assert.match(process.env.DATABASE_URL, /test/);

const { default: prisma } = await import("../src/config/prisma.js");
const { app } = await import("../src/app.js");

// Estado compartido a lo largo de los pasos del flujo
const estado = {
  rubros: {},
  localidadId: null,
  tokenAdminSetup: null,
  tokenAdminFlujo: null,
  artesanoA: { usuarioId: null, artesanoId: null, solicitudId: null, token: null },
  artesanoB: { usuarioId: null, artesanoId: null, solicitudId: null, token: null },
  artesanoC: { usuarioId: null, artesanoId: null, solicitudId: null, token: null },
  producto1Id: null,
  producto2Id: null,
};

before(async () => {
  await prisma.$connect();

  // Limpieza en orden de dependencias
  await prisma.$transaction([
    prisma.producto.deleteMany(),
    prisma.solicitud.deleteMany(),
    prisma.stand.deleteMany(),
    prisma.artesano.deleteMany(),
    prisma.tokenRevocado.deleteMany(),
    prisma.usuario.deleteMany(),
  ]);

  // Asegurar roles, localidad, rubros y cuenta de Administrador base
  const rolAdmin = await prisma.rol.upsert({
    where: { nombre: "ADMINISTRADOR" },
    update: {},
    create: { nombre: "ADMINISTRADOR", descripcion: "Acceso total" },
  });

  await prisma.rol.upsert({
    where: { nombre: "ARTESANO" },
    update: {},
    create: { nombre: "ARTESANO", descripcion: "Postulante y artesano" },
  });

  const localidad = await prisma.localidad.upsert({
    where: { nombre_locacion: "San Fernando del Valle de Catamarca" },
    update: {},
    create: { nombre_locacion: "San Fernando del Valle de Catamarca" },
  });
  estado.localidadId = localidad.id_localidad;

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
// PASO 0: Postulación de Artesanos, listado de PENDIENTES y aprobación
// ===========================================================================
test("Paso 0: Registro de 3 postulantes, listado de solicitudes PENDIENTES como Admin y aprobación de Artesanos A y B", async () => {
  // 0.1 Registro Artesano A
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
  assert.equal(resA.body.artesano.estado, "INACTIVO");
  assert.equal(resA.body.solicitud.estado_solicitud, "PENDIENTE");

  // 0.2 Registro Artesano B
  const resB = await request(app)
    .post("/usuarios/registro")
    .send({
      nombre: "Martín",
      apellido: "Alfarero",
      dni: "38333444",
      email: "martin.alfarero@ponchodigital.com",
      telefono: "3834333444",
      password: "Artesano2026!",
      localidadId: estado.localidadId,
      rubroId: estado.rubros.ceramica,
      nombre_emprendimiento: "Barro Catamarqueño",
      descripcion_emprendimiento: "Piezas de alfarería y cerámica horneada a leña",
    })
    .expect(201);

  estado.artesanoB.usuarioId = resB.body.id_usuario;
  estado.artesanoB.artesanoId = resB.body.artesano.id_artesano;
  estado.artesanoB.solicitudId = resB.body.solicitud.id_solicitud;

  // 0.3 Registro Artesano C (quedará PENDIENTE)
  const resC = await request(app)
    .post("/usuarios/registro")
    .send({
      nombre: "Pedro",
      apellido: "Postulante",
      dni: "38555666",
      email: "pedro.pendiente@ponchodigital.com",
      telefono: "3834555666",
      password: "Artesano2026!",
      localidadId: estado.localidadId,
      rubroId: estado.rubros.madera,
      nombre_emprendimiento: "Maderas del Valle",
      descripcion_emprendimiento: "Tallado artesanal en madera de algarrobo",
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

  estado.tokenAdminSetup = loginAdmin.body.token;

  // 0.5 Listar solicitudes PENDIENTES
  const pendientes = await request(app)
    .get("/solicitudes?estado_solicitud=PENDIENTE&pagina=1&limite=10")
    .set("Authorization", `Bearer ${estado.tokenAdminSetup}`)
    .expect(200);

  assert.equal(pendientes.body.solicitudes.length, 3);

  // 0.6 y 0.7 Aprobar Solicitudes de Artesano A y Artesano B
  const aprobA = await request(app)
    .patch(`/solicitudes/${estado.artesanoA.solicitudId}/aprobar`)
    .set("Authorization", `Bearer ${estado.tokenAdminSetup}`)
    .send({ observaciones_admin: "Artesano A habilitado." })
    .expect(200);

  assert.equal(aprobA.body.solicitud.estado_solicitud, "APROBADO");
  assert.equal(aprobA.body.artesano.estado, "ACTIVO");

  const aprobB = await request(app)
    .patch(`/solicitudes/${estado.artesanoB.solicitudId}/aprobar`)
    .set("Authorization", `Bearer ${estado.tokenAdminSetup}`)
    .send({ observaciones_admin: "Artesano B habilitado." })
    .expect(200);

  assert.equal(aprobB.body.solicitud.estado_solicitud, "APROBADO");
  assert.equal(aprobB.body.artesano.estado, "ACTIVO");
});

// ===========================================================================
// PASO 1: Catálogo público, paginación y errores 400 / 401
// ===========================================================================
test("Paso 1: Catálogo público paginado (200), rango de precios invertido (400) y creación sin token (401)", async () => {
  const catalogo = await request(app)
    .get("/productos?pagina=1&limite=5")
    .expect(200);

  assert.ok(Array.isArray(catalogo.body.productos));
  assert.equal(catalogo.body.paginacion.pagina, 1);

  await request(app)
    .get("/productos?precioDesde=100000&precioHasta=10000")
    .expect(400);

  const sinToken = await request(app)
    .post("/productos")
    .send({ nombre_producto: "Poncho sin token", precio: 90000 })
    .expect(401);

  assert.equal(sinToken.body.mensaje, "Se requiere un token de acceso.");
});

// ===========================================================================
// PASO 2: Login Artesano A, rechazos de esquema (400) y alta de 2 productos (201)
// ===========================================================================
test("Paso 2: Login Artesano A, rechazo de artesanoId en body (400), precio negativo (400) y alta de 2 productos propios (201)", async () => {
  const loginA = await request(app)
    .post("/usuarios/login")
    .send({ email: "lucas.tejedor@ponchodigital.com", password: "Artesano2026!" })
    .expect(200);

  estado.artesanoA.token = loginA.body.token;

  // 2.2 Error 400: Inyección de artesanoId en el body
  await request(app)
    .post("/productos")
    .set("Authorization", `Bearer ${estado.artesanoA.token}`)
    .send({
      nombre_producto: "Poncho intentando forzar artesanoId",
      precio: 120000,
      artesanoId: 1,
    })
    .expect(400);

  // 2.3 Error 400: Precio negativo y nombre vacío
  await request(app)
    .post("/productos")
    .set("Authorization", `Bearer ${estado.artesanoA.token}`)
    .send({ nombre_producto: "   ", precio: -500 })
    .expect(400);

  // 2.4 Crear Producto 1 válido
  const prod1 = await request(app)
    .post("/productos")
    .set("Authorization", `Bearer ${estado.artesanoA.token}`)
    .send({ nombre_producto: "Poncho Belicho de Vicuña", precio: 180000 })
    .expect(201);

  estado.producto1Id = prod1.body.id_producto;
  assert.equal(prod1.body.artesanoId, estado.artesanoA.artesanoId);

  // 2.5 Crear Producto 2 válido
  const prod2 = await request(app)
    .post("/productos")
    .set("Authorization", `Bearer ${estado.artesanoA.token}`)
    .send({ nombre_producto: "Bufanda de Lana de Oveja", precio: 35000 })
    .expect(201);

  estado.producto2Id = prod2.body.id_producto;
  assert.equal(prod2.body.artesanoId, estado.artesanoA.artesanoId);
});

// ===========================================================================
// PASO 3: Búsqueda por nombre, /productos/me, actualización y detalle por ID
// ===========================================================================
test("Paso 3: Búsqueda por nombre (200), GET /productos/me (200), actualización PATCH (200) y consulta por ID (200 / 404 / 400)", async () => {
  // 3.1 Buscar por nombre
  const porNombre = await request(app)
    .get("/productos?nombre_producto=Belicho")
    .expect(200);

  assert.equal(porNombre.body.productos.length, 1);
  assert.equal(porNombre.body.productos[0].id_producto, estado.producto1Id);

  // 3.2 Consultar mis propios productos
  const misProd = await request(app)
    .get("/productos/me")
    .set("Authorization", `Bearer ${estado.artesanoA.token}`)
    .expect(200);

  assert.equal(misProd.body.length, 2);

  // 3.3 Actualizar Producto 1
  const actualizado = await request(app)
    .patch(`/productos/${estado.producto1Id}`)
    .set("Authorization", `Bearer ${estado.artesanoA.token}`)
    .send({ nombre_producto: "Poncho Belicho de Vicuña Premium", precio: 195000 })
    .expect(200);

  assert.equal(actualizado.body.precio, 195000);

  // 3.4 Error 400: Body vacío {}
  await request(app)
    .patch(`/productos/${estado.producto1Id}`)
    .set("Authorization", `Bearer ${estado.artesanoA.token}`)
    .send({})
    .expect(400);

  // 3.5 Consultar por ID para verificar cambios
  const detalle = await request(app)
    .get(`/productos/${estado.producto1Id}`)
    .expect(200);

  assert.equal(detalle.body.nombre_producto, "Poncho Belicho de Vicuña Premium");
  assert.equal(detalle.body.precio, 195000);

  // 3.6 Error 404: ID inexistente y 3.7 Error 400: ID inválido
  await request(app).get("/productos/999999").expect(404);
  await request(app).get("/productos/id-invalido").expect(400);
});

// ===========================================================================
// PASO 4: Seguridad y propiedad cruzada (Artesano Pendiente y Artesano B)
// ===========================================================================
test("Paso 4: Rechazo 403 a artesano PENDIENTE y rechazo 404 a Artesano B al intentar modificar o eliminar producto de Artesano A", async () => {
  // 4.1 y 4.2 Artesano C (PENDIENTE) intenta crear producto -> 403
  const loginC = await request(app)
    .post("/usuarios/login")
    .send({ email: "pedro.pendiente@ponchodigital.com", password: "Artesano2026!" })
    .expect(200);

  estado.artesanoC.token = loginC.body.token;

  await request(app)
    .post("/productos")
    .set("Authorization", `Bearer ${estado.artesanoC.token}`)
    .send({ nombre_producto: "Mesa de algarrobo", precio: 80000 })
    .expect(403);

  // 4.3 Login Artesano B (Habilitado)
  const loginB = await request(app)
    .post("/usuarios/login")
    .send({ email: "martin.alfarero@ponchodigital.com", password: "Artesano2026!" })
    .expect(200);

  estado.artesanoB.token = loginB.body.token;

  // 4.4 Artesano B intenta modificar Producto 1 de Artesano A -> 404
  const patchAjeno = await request(app)
    .patch(`/productos/${estado.producto1Id}`)
    .set("Authorization", `Bearer ${estado.artesanoB.token}`)
    .send({ precio: 1000 })
    .expect(404);

  assert.equal(patchAjeno.body.mensaje, "Registro no encontrado.");

  // 4.5 Artesano B intenta eliminar Producto 1 de Artesano A -> 404
  await request(app)
    .delete(`/productos/${estado.producto1Id}`)
    .set("Authorization", `Bearer ${estado.artesanoB.token}`)
    .expect(404);

  // Comprobar en PostgreSQL que el Producto 1 sigue intacto y perteneciendo a Artesano A
  const enBD = await prisma.producto.findUniqueOrThrow({
    where: { id_producto: estado.producto1Id },
  });
  assert.equal(enBD.precio, 195000);
  assert.equal(enBD.artesanoId, estado.artesanoA.artesanoId);
});

// ===========================================================================
// PASO 5: Eliminación de producto propio (Artesano A)
// ===========================================================================
test("Paso 5: Artesano A elimina su Producto 2 (204), verifica 404 y comprueba que Producto 1 sigue activo", async () => {
  await request(app)
    .delete(`/productos/${estado.producto2Id}`)
    .set("Authorization", `Bearer ${estado.artesanoA.token}`)
    .expect(204);

  await request(app)
    .get(`/productos/${estado.producto2Id}`)
    .expect(404);

  const catalogoA = await request(app)
    .get(`/productos?artesanoId=${estado.artesanoA.artesanoId}`)
    .expect(200);

  assert.equal(catalogoA.body.productos.length, 1);
  assert.equal(catalogoA.body.productos[0].id_producto, estado.producto1Id);
});

// ===========================================================================
// PASO 6: Rol Admin, baja lógica de Artesano A, conservación de propiedad y Logout
// ===========================================================================
test("Paso 6: Admin no puede crear productos (403), da de baja lógica a Artesano A (200), se oculta en catálogo público, conserva propiedad en /me (200), se bloquea alta inactivo (403) y revoca token en logout (204 -> 401)", async () => {
  // 6.1 Login Admin
  const loginAdmin = await request(app)
    .post("/usuarios/login")
    .send({ email: "admin@ponchodigital.com", password: "AdminPoncho2026!" })
    .expect(200);

  estado.tokenAdminFlujo = loginAdmin.body.token;

  // 6.2 Admin intenta crear producto -> 403
  await request(app)
    .post("/productos")
    .set("Authorization", `Bearer ${estado.tokenAdminFlujo}`)
    .send({ nombre_producto: "Producto creado por Admin", precio: 50000 })
    .expect(403);

  // 6.3 Admin da de baja lógica al Artesano A -> 200 (pasa a INACTIVO)
  const baja = await request(app)
    .delete(`/artesanos/${estado.artesanoA.artesanoId}`)
    .set("Authorization", `Bearer ${estado.tokenAdminFlujo}`)
    .expect(200);

  assert.equal(baja.body.mensaje, "Artesano dado de baja exitosamente");

  const artesanoEnBD = await prisma.artesano.findUniqueOrThrow({
    where: { id_artesano: estado.artesanoA.artesanoId },
  });
  assert.equal(artesanoEnBD.estado, "INACTIVO");

  // 6.4 En el catálogo público los productos del Artesano A quedan ocultos ([])
  const catalogoPublico = await request(app)
    .get(`/productos?artesanoId=${estado.artesanoA.artesanoId}`)
    .expect(200);

  assert.equal(catalogoPublico.body.productos.length, 0);

  // 6.5 En su ruta privada GET /productos/me el Artesano A sigue viendo su producto (no perdió propiedad)
  const misProdInactivo = await request(app)
    .get("/productos/me")
    .set("Authorization", `Bearer ${estado.artesanoA.token}`)
    .expect(200);

  assert.equal(misProdInactivo.body.length, 1);
  assert.equal(misProdInactivo.body[0].id_producto, estado.producto1Id);

  // 6.6 Artesano A (INACTIVO) intenta publicar un nuevo producto -> 403
  await request(app)
    .post("/productos")
    .set("Authorization", `Bearer ${estado.artesanoA.token}`)
    .send({ nombre_producto: "Poncho estando inactivo", precio: 110000 })
    .expect(403);

  // 6.7 Logout del Administrador -> 204
  await request(app)
    .post("/usuarios/logout")
    .set("Authorization", `Bearer ${estado.tokenAdminFlujo}`)
    .expect(204);

  // 6.8 Intentar reutilizar el token revocado del Administrador -> 401
  const tokenRevocado = await request(app)
    .get("/usuarios/me")
    .set("Authorization", `Bearer ${estado.tokenAdminFlujo}`)
    .expect(401);

  assert.equal(tokenRevocado.body.mensaje, "Token inválido, vencido o revocado.");
});
