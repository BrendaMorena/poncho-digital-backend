import {artesanos, siguienteId} from '../data/artesanos.js';
import { crearError } from '../utils/errores.js';


export const obtenerArtesanos = (req, res) => {
    const { autor, anio } = req.query;

        let resultado = artesanos;

        if (autor) {
            resultado = resultado.filter(artesano => artesano.autor.toLowerCase().includes(autor.toLowerCase()));
        }

        if (anio) {
            resultado = resultado.filter(artesano => artesano.anio === Number(anio));
        }
        res.json(resultado);
};

export const obtenerArtesanoPorId = (req, res, next) => {

    const artesano = artesanos.find(artesano => artesano.id === req.artesanoId);

    if (!artesano) {
        return next(crearError(`no existe un artesano con id ${req.artesanoId}`, 404));
    }

    res.json(artesano);
};


export const crearArtesano = (req, res, next) => {
    const { nombre, rubro, localidad } = req.body;

    if (!nombre || !rubro || !localidad) {
        return next(crearError('Faltan datos obligatorios: nombre, rubro y localidad son requeridos', 400));
    }

    const nuevoArtesano = { id: siguienteId(artesanos), nombre, rubro, localidad };

    artesanos.push(nuevoArtesano);
    res.status(201).json(nuevoArtesano);
};

export const actualizarArtesano = (req, res, next) => {

    const artesano = artesanos.find(artesano => artesano.id === req.artesanoId);

    if (!artesano) {
        return next(crearError(`no existe un artesano con id ${req.artesanoId}`, 404));
    }

    const { nombre, rubro, localidad } = req.body;

    if (!nombre || !rubro || !localidad) {
        return next(crearError('Faltan datos obligatorios: nombre, rubro y localidad son requeridos', 400));
    }

    artesano.nombre = nombre;
    artesano.rubro = rubro;
    artesano.localidad = localidad;

    res.json(artesano);
};

export const eliminarArtesano = (req, res, next) => {

    const indice = artesanos.findIndex(artesano => artesano.id === req.artesanoId);

    if (indice === -1) {
        return next(crearError(`no existe un artesano con id ${req.artesanoId}`, 404));
    }

    artesanos.splice(indice, 1);
    res.status(204).send();
};