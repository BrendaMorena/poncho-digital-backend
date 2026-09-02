import express from 'express';


const app = express();
app.use(logger); // Middleware de registro de solicitudes
app.use(express.json());

const PORT = 5500;

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
//app.use('/', Routes);


app.use(noEncontrado); // Middleware de manejo de rutas no encontradas
app.use(manejadorErrores); // Middleware de manejo de errores, siempre va al ultimo

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});