import test from "node:test";
import assert from "node:assert/strict";
import { crearProductoSchema } from "../src/validators/productos.schema.js";

const casos = [
  ["entrada válida", { nombre_producto: "Poncho de vicuña", precio: 150000 }, true],
  ["campos ausentes", {}, false],
  ["falta nombre_producto", { precio: 150000 }, false],
  ["nombre_producto vacío", { nombre_producto: "", precio: 150000 }, false],
  ["falta precio", { nombre_producto: "Mate tallado" }, false],
  ["precio igual a cero", { nombre_producto: "Mate tallado", precio: 0 }, false],
  ["precio negativo", { nombre_producto: "Mate tallado", precio: -500 }, false],
  ["precio en texto", { nombre_producto: "Mate tallado", precio: "1500" }, false],
  ["campo adicional artesanoId", { nombre_producto: "Vasija", precio: 20000, artesanoId: 5 }, false],
];

for (const [nombre, entrada, valido] of casos) {
  test(`Esquema: ${nombre}`, () => {
    const resultado = crearProductoSchema.safeParse(entrada);
    assert.equal(resultado.success, valido);
  });
}