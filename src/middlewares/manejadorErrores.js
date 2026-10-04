export const manejadorErrores = (err, req, res, next) => {
    const status = err.status || 500;

    if ( status >= 500 ) {
        console.error(err);
        return res.status(status).json({ error: 'Error interno del servidor' });
    }

    const respuesta = { error: err.message };
    if (err.detalles) {
        respuesta.detalles = err.detalles;
    }

    res.status(status).json(respuesta);
};