import express from "express";
import { obtenerArtesanos, obtenerArtesanoPorId, crearArtesano } from "../controllers/artesanos.controller.js";

const router = express.Router();


router.get("/", obtenerArtesanos); // ruta para listar los artesanos
router.get("/:id", obtenerArtesanoPorId); // Ruta para obtener por ID
router.post("/", crearArtesano);          // Ruta para crear uno nuevo
router.put("/:id", actualizarArtesano); //Ruta para actualizar artesano
router.delete("/:id", eliminarArtesano) //Ruta para eliminar artesano

export default router;
