import jwt from "jsonwebtoken";
import { secretoJWT } from "../config/jwt.js";
import { randomUUID } from "node:crypto";

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const generarToken = (usuario) => {
  return jwt.sign({ sub: usuario.id_usuario, jti: randomUUID() }, secretoJWT, {
    algorithm: "HS256",
    expiresIn: "1m",
  });
};

export const verificarToken = (token) => {
  const payload = jwt.verify(token, secretoJWT, {
    algorithms: ["HS256"],
  });
  if (
    typeof payload !== "object" ||
    payload === null ||
    !uuidRegex.test(payload.sub) ||
    !Number.isFinite(payload.exp)
  ) {
    throw new jwt.JsonWebTokenError("Contenido del token inválido.");
  }
  if (typeof payload.jti !== "string" || !payload.jti.trim()) {
    throw new jwt.JsonWebTokenError("Falta el identificador del token.");
  }

  return {
    id: payload.sub,
    jti: payload.jti,
    exp: payload.exp,
  };
};
