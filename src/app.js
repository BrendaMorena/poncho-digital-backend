import express from 'express';

//import standsRoutes from './routes/artesanos.routes.js'
import artesanosRoutes from './routes/artesanos.routes.js';
import rubrosRoutes from './routes/rubros.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import { logger } from './middlewares/logger.js';
import { manejadorErrores } from './middlewares/manejadorErrores.js';
import { noEncontrado } from './middlewares/noEncontrado.js';
import { z } from 'zod';

import standsRoutes from './routes/stands.routes.js';
import pabellonesRoutes from './routes/pabellones.routes.js';
import sectoresRoutes from './routes/sectores.routes.js';
import rolesRoutes from './routes/roles.routes.js';
import solicitudesRoutes from './routes/solicitudes.routes.js';
import { logger } from './middlewares/logger.js';
import { manejadorErrores } from './middlewares/manejadorErrores.js';
import { noEncontrado } from './middlewares/noEncontrado.js';
import {z} from 'zod';


z.config(z.locales.es())
const app = express();
app.use(logger); // Middleware de registro de solicitudes
app.use(express.json());




const PORT = process.env.PORT || 5500;


app.get('/', (req, res) => {
    res.send('Bienvenido a la API REST de Poncho Digital');
});

app.get('/info', (req, res) => {
    res.json({
        nombre: 'API REST Poncho Digital',
        version: '1.0.0',
        autor: 'Aguero-Velez Lucas-Gabriel, Barrionuevo Brenda Morena, Reyna Sebastian-Raul',
        estado: 'En desarrollo'
    });
} );


app.use('/artesanos', artesanosRoutes);
app.use('/rubros', rubrosRoutes);
app.use('/usuarios', usuariosRoutes);

// app.use('/artesanos', artesanosRoutes);
app.use('/stands', standsRoutes);
app.use('/pabellones', pabellonesRoutes);
app.use('/sectores', sectoresRoutes);
app.use('/roles', rolesRoutes);
app.use('/solicitudes', solicitudesRoutes);



app.use(noEncontrado); // Middleware de manejo de rutas no encontradas
app.use(manejadorErrores); // Middleware de manejo de errores, siempre va al ultimo

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});