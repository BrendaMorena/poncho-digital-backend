import express from "express";
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "node:fs";

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
export const app = express();
const PORT = process.env.PORT || 5500;
const swaggerDocument = JSON.parse(
  readFileSync(new URL("../swagger-output.json", import.meta.url), "utf8"),
);

app.use(logger); // Middleware de registro de solicitudes
app.use(express.json());

// Publicar Swagger UI antes del manejador 404.
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  // #swagger.tags = ["General"]
  // #swagger.summary = "Mensaje de bienvenida de la API"
  // #swagger.security = []
  res.send("Bienvenido a la API REST de Poncho Digital");
});

app.get("/info", (req, res) => {
  // #swagger.tags = ["General"]
  // #swagger.summary = "Información general de la API"
  // #swagger.security = []
  res.json({
    nombre: "API REST Poncho Digital",
    version: "1.0.0",
    autor:
      "Aguero-Velez Lucas-Gabriel, Barrionuevo Brenda Morena, Reyna Sebastian-Raul",
    estado: "En desarrollo",
  });
});

app.use(
  "/productos",
  productosRoutes
  /* #swagger.tags = ["Productos"] */
);
app.use(
  "/artesanos",
  artesanosRoutes
  /* #swagger.tags = ["Artesanos"] */
);
app.use(
  "/rubros",
  rubrosRoutes
  /* #swagger.tags = ["Rubros"] */
);
app.use(
  "/usuarios",
  usuariosRoutes
  /* #swagger.tags = ["Usuarios"] */
);
app.use(
  "/stands",
  standsRoutes
  /* #swagger.tags = ["Stands"] */
);
app.use(
  "/pabellones",
  pabellonesRoutes
  /* #swagger.tags = ["Pabellones"] */
);
app.use(
  "/sectores",
  sectoresRoutes
  /* #swagger.tags = ["Sectores"] */
);
app.use(
  "/roles",
  rolesRoutes
  /* #swagger.tags = ["Roles"]
     #swagger.security = [{ bearerAuth: [] }] */
);
app.use(
  "/busquedas",
  busquedasRoutes
  /* #swagger.tags = ["Búsquedas"] */
);
app.use(
  "/solicitudes",
  solicitudesRoutes
  /* #swagger.tags = ["Solicitudes"]
     #swagger.security = [{ bearerAuth: [] }] */
);
app.use(
  "/localidades",
  localidadesRoutes
  /* #swagger.tags = ["Localidades"] */
);

app.use(noEncontrado); // Middleware de manejo de rutas no encontradas
app.use(manejadorErrores); // Manejador centralizado de errores (Prisma, Zod y negocio)

// Al importar app desde las pruebas no se abre un puerto ni se inicia la tarea.
if (process.env.NODE_ENV !== "test")
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
    iniciarLimpiezaRevocaciones();
  });
