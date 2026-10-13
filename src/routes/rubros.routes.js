import express from "express";
import { obtenerRubros, obtenerRubroPorId, crearRubro, actualizarRubro, eliminarRubro } from "../controllers/rubro.controller.js";
import { validarRubro } from "../middlewares/validation/rubros.middleware.js";
import { crearRubroSchema, actualizarRubroSchema } from "../validators/rubros.schema.js";
import { validarRubroId } from "../middlewares/base/validarId.js";

const router = express.Router();

router.get("/", obtenerRubros);
router.get("/:id", validarRubroId, obtenerRubroPorId);


// RUTAS PRIVADAS (Solo Administradores)
// Agregar middleware verificarAdmin cuando hagamos el Login

router.post("/", validarRubro(crearRubroSchema), crearRubro);
router.patch("/:id", validarRubroId, validarRubro(actualizarRubroSchema), actualizarRubro);
router.delete("/:id", validarRubroId, eliminarRubro);

export default router;