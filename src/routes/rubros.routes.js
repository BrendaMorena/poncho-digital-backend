import express from "express";
import { obtenerRubros, obtenerRubroPorId, crearRubro, actualizarRubro, eliminarRubro } from "../controllers/rubro.controller.js";
import { validarCreacionRubro, validarActualizarRubro } from "../middlewares/validation/rubros.middleware.js";
import { validarRubroId } from "../middlewares/base/validarId.js";

const router = express.Router();

router.get("/", obtenerRubros);
router.get("/:id", validarRubroId, obtenerRubroPorId);


// RUTAS PRIVADAS (Solo Administradores)
// Agregar middleware verificarAdmin cuando hagamos el Login

router.post("/", validarCreacionRubro, crearRubro);
router.patch("/:id", validarRubroId, validarActualizarRubro, actualizarRubro);
router.delete("/:id", validarRubroId, eliminarRubro);

export default router;