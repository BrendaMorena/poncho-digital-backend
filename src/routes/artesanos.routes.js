import express from "express";
import { obtenerArtesanos } from "../controllers/artesanos.controller.js";

const router = express.Router();

// Esta ruta responderá cuando alguien pida la lista de artesanos
router.get("/", obtenerArtesanos);

export default router;
