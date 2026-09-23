export const manejadorErrores = (err, req, res, next) => {
    const status = err.status || 500;

    if ( status >= 500 ) {
        console.error(err);
        return res.status(status).json({ error: 'Error interno del servidor' });
    }

    const cuerpo = {error: err.message};
    if (err.detalles) {
        cuerpo.detalles = err.detalles;
    }

    res.status(status).json(cuerpo);
}