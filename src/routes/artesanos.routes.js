import express from 'express';
import { obtenerArtesanos, obtenerArtesanoPorId, crearArtesano, actualizarArtesano, eliminarArtesano } from '../controllers/artesanos.controller.js';
import { validarArtesanosId } from '../middlewares/validarId.js';

const router = express.Router();

router.get('/', obtenerArtesanos);
router.get('/:id', validarArtesanosId, obtenerArtesanoPorId);
router.post('/', crearArtesano);
router.put('/:id', validarArtesanosId, actualizarArtesano);
router.delete('/:id', validarArtesanosId, eliminarArtesano);

export default router;