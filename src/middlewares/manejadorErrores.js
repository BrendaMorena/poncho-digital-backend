export const manejadorErrores = (err, req, res, next) => {
    const status = err.status || 500;

    if ( status >= 500 ) {
        console.error(err);
        return res.status(status).json({ error: 'Error interno del servidor' });
    }
    // Si el error trae detalles de Zod
    if (err.detalles) {
        return res.status(status).json({ error: err.message, detalles: err.detalles });
    }
    // si no trae detalles, 
     return res.status(status).json({ error: err.message });
}