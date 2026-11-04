import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "secreto-exclusivo-de-pruebas";
const { app } = await import("../src/app.js");
const cuerpoProducto = {
  nombre_producto: "Poncho Catamarqueño",
  precio: 85000,
};
// Caso 1: Sin token -> 401
test("POST /productos sin token devuelve 401", async () => {
  const respuesta = await request(app)
    .post("/productos")
    .send(cuerpoProducto)
    .expect("Content-Type", /json/)
    .expect(401);
  assert.deepEqual(respuesta.body, {
    mensaje: "Se requiere un token de acceso.",
  });
});
// Caso 2: Cabecera mal formada -> 400
test("Cabecera mal formada devuelve 400", async () => {
  await request(app)
    .post("/productos")
    .set("Authorization", "Basic abc")
    .send(cuerpoProducto)
    .expect("Content-Type", /json/)
    .expect(400, {
      mensaje: "Usar Authorization: Bearer <token>.",
    });
});
// Caso 3: Token inválido -> 401
test("Token inválido devuelve 401", async () => {
  await request(app)
    .post("/productos")
    .set("Authorization", "Bearer token-invalido")
    .send(cuerpoProducto)
    .expect("Content-Type", /json/)
    .expect(401, {
      mensaje: "Token inválido, vencido o revocado.",
    });
});
// Caso 4: Rol que no corresponde (ADMINISTRADOR intenta crear producto) -> 403
test("Rol que no corresponde devuelve 403", async () => {
  const idAdmin = "a0000000-0000-4000-8000-000000000001";
  const tokenAdmin = jwt.sign(
    { sub: idAdmin, jti: randomUUID() },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: "5m" }
  );
  const respuesta = await request(app)
    .post("/productos")
    .set("Authorization", `Bearer ${tokenAdmin}`)
    .send(cuerpoProducto)
    .expect("Content-Type", /json/)
    .expect(403);
  assert.equal(
    respuesta.body.error,
    "Acceso denegado: no posee los permisos requeridos."
  );
});