import express from "express";
import { obtenerRubros, obtenerRubroPorId, crearRubro, actualizarRubro, eliminarRubro } from "../controllers/rubros.controller.js";
import { validarRubro } from "../middlewares/rubros.middleware.js";
import { crearRubroSchema } from "../validators/rubros.schemas.js";
import { validarRubroId } from "../middlewares/validarId.js";

const router = express.Router();

router.get("/", obtenerRubros);
router.get("/:id", validarRubroId, obtenerRubroPorId);


// RUTAS PRIVADAS (Solo Administradores)
// Agregar middleware verificarAdmin cuando hagamos el Login

router.post("/", validarRubro(crearRubroSchema), crearRubro);
router.patch("/:id", validarRubroId, validarRubro(crearRubroSchema), actualizarRubro);
router.delete("/:id", validarRubroId, eliminarRubro);

export default router;