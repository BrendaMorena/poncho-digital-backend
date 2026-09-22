import express from "express";
import { obtenerArtesanos, obtenerArtesanoPorId, crearArtesano, actualizarArtesano, eliminarArtesano } from "../controllers/artesanos.controller.js";
import { crearArtesanoSchema, actualizarArtesanoSchema } from "../validators/artesanos.schemas.js";

const router = express.Router();


router.get("/", obtenerArtesanos); // ruta para listar los artesanos
router.get("/:id", validarArtesanoId,obtenerArtesanoPorId); // Ruta para obtener por ID
router.post("/", crearArtesano);          // Ruta para crear uno nuevo
router.put("/:id", validarArtesanoId, actualizarArtesano); //Ruta para actualizar artesano
router.delete("/:id", validarArtesanoId, eliminarArtesano) //Ruta para eliminar artesano

router.post("/", validarArtesanos(crearArtesanoSchema), crearArtesano);
router.put("/:id", validarArtesanos(actualizarArtesanoSchema), actualizarArtesano);

export default router;
