import express from "express";

//import standsRoutes from './routes/artesanos.routes.js'
import artesanosRoutes from "./routes/artesanos.routes.js";
import rubrosRoutes from "./routes/rubros.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import standsRoutes from "./routes/stands.routes.js";
import pabellonesRoutes from "./routes/pabellones.routes.js";
import sectoresRoutes from "./routes/sectores.routes.js";
import rolesRoutes from "./routes/roles.routes.js";
import solicitudesRoutes from "./routes/solicitudes.routes.js";
import busquedasRoutes from "./routes/busquedas.routes.js";
import localidadesRoutes from "./routes/localidades.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import { logger } from "./middlewares/global/logger.js";
import { manejadorErrores } from "./middlewares/global/manejadorErrores.js";
import { noEncontrado } from "./middlewares/global/noEncontrado.js";
import { iniciarLimpiezaRevocaciones } from "./tareas/limpiezaRevocaciones.js";
import { z } from "zod";
import "./config/jwt.js";

z.config(z.locales.es());
const app = express();
app.use(logger); // Middleware de registro de solicitudes
app.use(express.json());

const PORT = process.env.PORT || 5500;

app.get("/", (req, res) => {
  res.send("Bienvenido a la API REST de Poncho Digital");
});

app.get("/info", (req, res) => {
  res.json({
    nombre: "API REST Poncho Digital",
    version: "1.0.0",
    autor:
      "Aguero-Velez Lucas-Gabriel, Barrionuevo Brenda Morena, Reyna Sebastian-Raul",
    estado: "En desarrollo",
  });
});

app.use("/productos", productosRoutes);
//app.use('/', Routes);

app.use("/artesanos", artesanosRoutes);
app.use("/rubros", rubrosRoutes);
app.use("/usuarios", usuariosRoutes);

// app.use('/artesanos', artesanosRoutes);
app.use("/stands", standsRoutes);
app.use("/pabellones", pabellonesRoutes);
app.use("/sectores", sectoresRoutes);
app.use("/roles", rolesRoutes);
app.use("/busquedas", busquedasRoutes);
app.use("/solicitudes", solicitudesRoutes);
app.use("/localidades", localidadesRoutes);

app.use(noEncontrado); // Middleware de manejo de rutas no encontradas
app.use(manejadorErrores); // Middleware de manejo de errores, siempre va al ultimo

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const mensajes = {
    P2002: "Ya existe un registro con esos datos únicos.",
    P2003: "La operación afecta registros relacionados.",
    P2025: "Registro no encontrado.",
    P2034: "Hubo otro cambio simultáneo. Reintentar.",
  };
  const mensajeErrorPrisma = mensajes[err.code];
  const estado = mensajeErrorPrisma
    ? err.code === "P2025"
      ? 404
      : 409
    : err.status || 500;
  const mensaje =
    estado >= 500
      ? "Error interno del servidor."
      : mensajeErrorPrisma || err.message;
  return res.status(estado).json({ mensaje });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
  iniciarLimpiezaRevocaciones();
});
