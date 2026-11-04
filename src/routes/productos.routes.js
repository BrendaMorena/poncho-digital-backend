import express from "express";
import {
  crearProducto,
  obtenerProductos,
  obtenerMisProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
} from "../controllers/productos.controller.js";
import {
  validarCreacionProducto,
  validarActualizarProducto,
  validarConsultaProducto,
} from "../middlewares/validation/producto.middleware.js";
import { validarProductoId } from "../middlewares/base/validarId.js";
import { autenticarUsuario } from "../middlewares/auth/autenticacion.middleware.js";
import {
  cargarContextoUsuario,
  soloArtesanoHabilitado,
} from "../middlewares/auth/autorizacion.middleware.js";

const router = express.Router();

// Rutas públicas
router.get(
  "/",
  /* #swagger.tags = ["Productos"]
     #swagger.summary = "Listar productos del catálogo"
     #swagger.description = "Acceso público. Permite filtrar por nombre, artesano, rubro y rango de precios."
     #swagger.auto = false
     #swagger.security = []
     #swagger.parameters['nombre_producto'] = { in: "query", description: "Coincidencia parcial por nombre del producto.", "@schema": { type: "string" } }
     #swagger.parameters['artesanoId'] = { in: "query", description: "ID del artesano.", "@schema": { type: "integer", minimum: 1 } }
     #swagger.parameters['rubroId'] = { in: "query", description: "ID del rubro artesanal.", "@schema": { type: "integer", minimum: 1 } }
     #swagger.parameters['precioDesde'] = { in: "query", description: "Precio mínimo; no debe superar precioHasta.", "@schema": { type: "number", minimum: 0 } }
     #swagger.parameters['precioHasta'] = { in: "query", description: "Precio máximo incluido.", "@schema": { type: "number", minimum: 0 } }
     #swagger.parameters['ordenPor'] = { in: "query", description: "Campo de ordenamiento.", "@schema": { type: "string", enum: ["nombre_producto", "precio", "createdAt"], default: "nombre_producto" } }
     #swagger.parameters['direccion'] = { in: "query", description: "Sentido del orden.", "@schema": { type: "string", enum: ["asc", "desc"], default: "asc" } }
     #swagger.parameters['pagina'] = { in: "query", description: "Página solicitada.", "@schema": { type: "integer", minimum: 1, default: 1 } }
     #swagger.parameters['limite'] = { in: "query", description: "Elementos por página.", "@schema": { type: "integer", minimum: 1, maximum: 50, default: 10 } }
     #swagger.responses[200] = { description: "Listado paginado de productos.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/ListadoProductos" } }
     } }
     #swagger.responses[400] = { description: "Filtros inválidos o rango de precios invertido." }
  */
  validarConsultaProducto,
  obtenerProductos
);

// --- Rutas de recurso propio para ARTESANO HABILITADO ---
router.get(
  "/me",
  /* #swagger.tags = ["Productos"]
     #swagger.summary = "Consultar mis productos"
     #swagger.description = "JWT, cuenta activa y rol ARTESANO habilitado (ACTIVO y solicitud APROBADO). Devuelve únicamente los productos propios."
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.responses[200] = { description: "Listado de productos propios del artesano autenticado.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/MisProductos" } }
     } }
     #swagger.responses[400] = { description: "Cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" },
         example: { mensaje: "Se requiere un token de acceso." } }
     } }
     #swagger.responses[403] = { description: "Cuenta inactiva, rol distinto de ARTESANO o artesano aún no habilitado." }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  soloArtesanoHabilitado,
  obtenerMisProductos
);

router.get(
  "/:id",
  /* #swagger.tags = ["Productos"]
     #swagger.summary = "Consultar un producto por ID"
     #swagger.description = "Acceso público."
     #swagger.auto = false
     #swagger.security = []
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.responses[200] = { description: "Detalle del producto.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/Producto" } }
     } }
     #swagger.responses[400] = { description: "ID inválido." }
     #swagger.responses[404] = { description: "El producto no existe.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" },
         example: { error: "No existe un producto con id 999", mensaje: "No existe un producto con id 999" } }
     } }
  */
  validarProductoId,
  obtenerProductoPorId
);

// Rutas protegidas para ARTESANO HABILITADO
router.post(
  "/",
  /* #swagger.tags = ["Productos"]
     #swagger.summary = "Crear un producto propio"
     #swagger.description = "JWT, cuenta activa y rol ARTESANO habilitado. El servidor asocia el producto al artesano del usuario autenticado; enviar artesanoId produce 400."
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/NuevoProducto" } }
     } }
     #swagger.responses[201] = { description: "Producto creado.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/ProductoCreado" } }
     } }
     #swagger.responses[400] = { description: "Cuerpo inválido (ej. enviar artesanoId o precio negativo) o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente, inválido, vencido o revocado; cuenta inexistente.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" },
         example: { mensaje: "Se requiere un token de acceso." } }
     } }
     #swagger.responses[403] = { description: "Cuenta inactiva, rol distinto de ARTESANO o artesano aún no habilitado." }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  soloArtesanoHabilitado,
  validarCreacionProducto,
  crearProducto
);

router.patch(
  "/:id",
  /* #swagger.tags = ["Productos"]
     #swagger.summary = "Actualizar un producto propio"
     #swagger.description = "JWT, cuenta activa y rol ARTESANO habilitado. Solo permite modificar productos propios; si el producto pertenece a otro artesano devuelve 404."
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.requestBody = { required: true, content: {
       "application/json": { schema: { $ref: "#/components/schemas/ActualizarProducto" } }
     } }
     #swagger.responses[200] = { description: "Producto actualizado.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/Producto" } }
     } }
     #swagger.responses[400] = { description: "ID o cuerpo inválidos, o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Cuenta inactiva, rol distinto de ARTESANO o artesano no habilitado." }
     #swagger.responses[404] = { description: "Producto inexistente o perteneciente a otro artesano.", content: {
       "application/json": { schema: { $ref: "#/components/schemas/ErrorApi" },
         example: { error: "Registro no encontrado.", mensaje: "Registro no encontrado." } }
     } }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  soloArtesanoHabilitado,
  validarProductoId,
  validarActualizarProducto,
  actualizarProducto
);

router.delete(
  "/:id",
  /* #swagger.tags = ["Productos"]
     #swagger.summary = "Eliminar un producto propio"
     #swagger.description = "JWT, cuenta activa y rol ARTESANO habilitado. Solo permite eliminar productos propios; si es ajeno o no existe devuelve 404."
     #swagger.auto = false
     #swagger.security = [{ bearerAuth: [] }]
     #swagger.parameters['id'] = { in: "path", required: true, "@schema": { type: "integer", minimum: 1, maximum: 2147483647 } }
     #swagger.responses[204] = { description: "Producto eliminado. Sin cuerpo de respuesta." }
     #swagger.responses[400] = { description: "ID inválido o cabecera Bearer mal formada." }
     #swagger.responses[401] = { description: "Token ausente o inválido." }
     #swagger.responses[403] = { description: "Cuenta inactiva, rol distinto de ARTESANO o artesano no habilitado." }
     #swagger.responses[404] = { description: "Producto inexistente o perteneciente a otro artesano." }
  */
  autenticarUsuario,
  cargarContextoUsuario,
  soloArtesanoHabilitado,
  validarProductoId,
  eliminarProducto
);

export default router;
