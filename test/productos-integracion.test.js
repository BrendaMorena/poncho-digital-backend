import { test, before, beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { crearEscenario } from "./helpers/escenario-productos.js";

assert.equal(process.env.NODE_ENV, "test");
assert.match(process.env.DATABASE_URL, /test/);

const { default: prisma } = await import("../src/config/prisma.js");
const { app } = await import("../src/app.js");

let datos;

// Conexión y desconexión
before(async () => {
  await prisma.$connect();
});

after(async () => {
  await prisma.$disconnect();
});

// Limpieza en orden de dependencias antes de cada test
beforeEach(async () => {
  await prisma.$transaction([
    prisma.producto.deleteMany(),
    prisma.solicitud.deleteMany(),
    prisma.stand.deleteMany(),
    prisma.artesano.deleteMany(),
    prisma.tokenRevocado.deleteMany(),
    prisma.usuario.deleteMany(),
  ]);

  datos = await crearEscenario(app, prisma);
});

// Helper para crear producto con token
const crearProducto = (token, producto) =>
  request(app)
    .post("/productos")
    .set("Authorization", `Bearer ${token}`)
    .send(producto);

// -------------------------------------------------------------
// Test 1: Persistencia y propiedad 
// -------------------------------------------------------------
test("Alta correcta de producto se guarda en PostgreSQL asociada a la cuenta autenticada", async () => {
  const { ana } = datos;

  const respuesta = await crearProducto(ana.token, {
    nombre_producto: "Poncho Catamarqueño de Vicuña",
    precio: 180000,
  }).expect(201);

  assert.equal(respuesta.body.nombre_producto, "Poncho Catamarqueño de Vicuña");
  assert.equal(respuesta.body.precio, 180000);

  // Verificación directa en PostgreSQL con Prisma
  const productoEnBD = await prisma.producto.findUniqueOrThrow({
    where: { id_producto: respuesta.body.id_producto },
  });

  assert.equal(productoEnBD.nombre_producto, "Poncho Catamarqueño de Vicuña");
  assert.equal(productoEnBD.artesanoId, ana.artesano.id_artesano);
});

// -------------------------------------------------------------
// Test 2: Listar productos propios excluyendo ajenos
// -------------------------------------------------------------
test("GET /productos/me devuelve únicamente los productos del artesano autenticado", async () => {
  const { ana, bruno } = datos;

  const prodAna = (await crearProducto(ana.token, { nombre_producto: "Manta Ana", precio: 50000 })).body;
  const prodBruno = (await crearProducto(bruno.token, { nombre_producto: "Tapiz Bruno", precio: 75000 })).body;

  const { body: misProductos } = await request(app)
    .get("/productos/me")
    .set("Authorization", `Bearer ${ana.token}`)
    .expect(200);

  const ids = misProductos.map((p) => p.id_producto);
  assert.ok(ids.includes(prodAna.id_producto));
  assert.ok(!ids.includes(prodBruno.id_producto));
});

// -------------------------------------------------------------
// Test 3: Acceso a recurso ajeno -> 404 
// -------------------------------------------------------------
test("Ana no puede modificar un producto existente de Bruno (devuelve 404) y el registro sigue perteneciendo a Bruno", async () => {
  const { ana, bruno } = datos;

  // Bruno crea su producto
  const prodBruno = (await crearProducto(bruno.token, {
    nombre_producto: "Poncho Original de Bruno",
    precio: 120000,
  })).body;

  // Ana intenta modificar el producto de Bruno con su propio token
  const respuesta = await request(app)
    .patch(`/productos/${prodBruno.id_producto}`)
    .set("Authorization", `Bearer ${ana.token}`)
    .send({ precio: 99999 })
    .expect(404);

  assert.equal(respuesta.body.mensaje, "Registro no encontrado.");

  // Comprobar que en PostgreSQL el producto sigue existiendo intacto y sigue siendo de Bruno
  const enBD = await prisma.producto.findUniqueOrThrow({
    where: { id_producto: prodBruno.id_producto },
  });

  assert.equal(enBD.precio, 120000);
  assert.equal(enBD.artesanoId, bruno.artesano.id_artesano);
});