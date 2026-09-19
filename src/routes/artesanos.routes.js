import express from "express";
import {} from "../controllers/stands.controller.js";
import { validarAutoresId } from "../middlewares/validarId.js";

const router = express.Router();

router.get("/:id", validarAutoresId);

export default router;
