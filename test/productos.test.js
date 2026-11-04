import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "secreto-exclusivo-de-pruebas";

const { app } = await import("../src/app.js");
const cuerpoProducto = {
  nombre_producto: "Poncho Catamarqueño",
  precio: 85000,
};

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