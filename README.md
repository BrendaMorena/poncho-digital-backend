# API REST - Poncho Digital (Feria Artesanal)

Sistema backend para la administración y gestión integral de la **Feria Nacional e Internacional del Poncho**. Esta API REST proporciona las herramientas necesarias para gestionar artesanos, catálogo de productos, asignación y distribución de stands en el predio ferial (pabellones y sectores), flujo de evaluación de postulaciones, localidades, rubros y analítica de búsquedas.

---

## 👥 Integrantes del Equipo

| Apellido y Nombre | Matrícula (MUN°) |
| :--- | :--- |
| **Agüero Vélez, Lucas Gabriel** | `00426` |
| **Barrionuevo, Brenda Morena** | `00059` |
| **Reyna, Sebastián Raúl** | `00354` |

---

## 🚀 Tecnologías y Herramientas

- **Runtime:** [Node.js](https://nodejs.org/) v24 LTS (con soporte experimental para tipos y modo observador nativo `--watch`).
- **Framework Web:** [Express.js](https://expressjs.com/) v5.
- **Base de Datos:** [PostgreSQL](https://www.postgresql.org/) (compatible con instancias locales y entornos Cloud como Supabase).
- **ORM / Capa de Datos:** [Prisma ORM](https://www.prisma.io/) v7 (`@prisma/client`, `@prisma/adapter-pg`).
- **Autenticación y Seguridad:** [JWT (JSON Web Tokens)](https://jwt.io/) con lista de revocación persistida en base de datos (`TokenRevocado`) y hasheo de contraseñas con [bcrypt](https://www.npmjs.com/package/bcrypt).
- **Validación de Datos:** [Zod](https://zod.dev/) v4 con mensajes regionalizados en español.
- **Documentación de API:** [Swagger UI Express](https://www.npmjs.com/package/swagger-ui-express) y especificación OpenAPI 3.0 autogenerada mediante [swagger-autogen](https://www.npmjs.com/package/swagger-autogen).
- **Testing:** Test Runner nativo de Node.js (`node:test`, `node:assert`) y [Supertest](https://www.npmjs.com/package/supertest).
- **Cliente HTTP y Pruebas Manuales:** Colecciones `.http` compatibles con la extensión REST Client.

---

## 🌟 Características Principales

1. **Arquitectura por Capas (N-Tier Architecture):**
   - **Rutas (`routes`):** Declaración semántica de endpoints, contratos Swagger y aplicación de middlewares.
   - **Controladores (`controllers`):** Recepción de solicitudes, delegación a la lógica de negocio y armado de respuestas HTTP.
   - **Servicios (`services`):** Lógica de negocio pura, validaciones de dominio y transacciones con la base de datos.
   - **Validadores (`validators` y `middlewares/validation`):** Validación estricta y sanitización de esquemas con Zod (`body`, `params`, `query`).
   - **Mapeo de Datos:** Prisma ORM con modelos relacionales normalizados, claves foráneas e integridad referencial.
2. **Autenticación & Autorización (RBAC):**
   - Control de acceso basado en roles: `ADMINISTRADOR`, `ORGANIZADOR`, `ARTESANO`, `USUARIO`.
   - Control fino de permisos (`soloAdmin`, `organizadoresYAdmins`, `soloArtesano`, `soloArtesanoHabilitado`).
   - Ciclo de vida seguro de tokens: inicio de sesión, cierre de sesión con revocación (`jti`) en base de datos y rutina programada para depuración automática de tokens expirados (`iniciarLimpiezaRevocaciones`).
3. **Flujo de Postulación y Habilitación de Artesanos:**
   - Registro público de cuenta con generación automática de perfil de artesano (`INACTIVO`) y solicitud en estado `PENDIENTE`.
   - Los organizadores y administradores evalúan la solicitud: pueden **aprobar**, **rechazar** o **solicitar modificaciones**.
   - Solo cuando la solicitud es aprobada y el artesano está activo se habilita la creación de productos y la asignación de stands.
4. **Distribución Física y Asignación de Stands:**
   - Jerarquía física del predio: `Pabellón` ➔ `Sector` ➔ `Stand`.
   - Asignación 1 a 1 de stands a artesanos habilitados y liberación de espacios.
   - Posicionamiento mediante coordenadas en formato JSON.
5. **Catálogo de Productos y Registro de Búsquedas:**
   - CRUD de productos asociados al artesano autenticado con control de propiedad.
   - Registro de términos de búsqueda del público con métricas por localidad, pabellón y rubro.
6. **Manejo Centralizado de Errores:**
   - Middleware global que captura errores de Prisma (códigos de unicidad, dependencias foráneas, no encontrados), errores de Zod y excepciones de negocio con respuestas JSON consistentes.
7. **Documentación OpenAPI / Swagger:**
   - Interfaz interactiva disponible en `/docs` para explorar y probar todos los endpoints y esquemas.

---

## 📋 Requisitos Previos

- **Node.js:** v24.0.0 o superior.
- **npm:** v10.0.0 o superior.
- **PostgreSQL:** Base de datos relacional local o alojada en la nube (ej. Supabase).
- **Git:** Para control de versiones.

---

## ⚙️ Variables de Entorno

El proyecto requiere variables de entorno para su correcto funcionamiento. Se deben configurar los archivos `.env` (desarrollo/producción) y opcionalmente `.env.test` (para pruebas de integración).

### Variables para Desarrollo (`.env`)

Copiar el archivo de ejemplo:
```bash
cp .env.example .env
```

| Variable | Tipo | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | String | Cadena de conexión principal a PostgreSQL | `postgresql://usuario:password@localhost:5432/poncho_digital?schema=public` |
| `DIRECT_URL` | String | Conexión directa a PostgreSQL (necesaria para migraciones en Supabase) | `postgresql://usuario:password@localhost:5432/poncho_digital` |
| `PORT` | Número | Puerto de escucha del servidor web | `3000` |
| `JWT_SECRET` | String | Clave secreta para la firma y verificación de tokens JWT | `tu_clave_secreta_super_segura` |

### Variables para Pruebas (`.env.test`)

Copiar el archivo de ejemplo para tests:
```bash
cp .env.test.example .env.test
```

> [!WARNING]
> Nunca utilizar la base de datos de desarrollo para las pruebas de integración, ya que los tests limpian las tablas. Las URLs de conexión para test deben incluir el parámetro `?env=test` por seguridad.

---

## 🛠️ Instalación y Puesta en Marcha

Sigue estos pasos para inicializar el proyecto en tu entorno local:

### 1. Clonar el repositorio
```bash
git clone https://github.com/BrendaMorena/poncho-digital-backend.git
cd trabajo-laboratorio
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea el archivo `.env` a partir de `.env.example` y define las credenciales de tu base de datos y la clave de JWT.

### 4. Ejecutar migraciones de Prisma
Aplica las migraciones en la base de datos para crear todas las tablas y enums:
```bash
npx prisma migrate dev
```
O en caso de solo desplegar:
```bash
npx prisma migrate deploy
```

### 5. Semillar la base de datos (Seed)
Carga los datos iniciales necesarios (roles del sistema, 166 localidades de Catamarca, 9 rubros, pabellones, sectores, stands y usuarios de prueba):
```bash
npm run seed
```

### 6. Generar documentación Swagger
Genera el contrato OpenAPI `swagger-output.json` a partir de las anotaciones de las rutas:
```bash
npm run docs
```

### 7. Iniciar el servidor

- **Modo Desarrollo (con recarga automática):**
  ```bash
  npm run dev
  ```
- **Modo Producción:**
  ```bash
  npm start
  ```

El servidor estará escuchando en `http://localhost:3000`.

---

## 📖 Documentación Interactiva (Swagger UI)

Una vez iniciado el servidor, puedes acceder a la interfaz gráfica interactiva de Swagger UI en:

👉 **[http://localhost:3000/docs](http://localhost:3000/docs)**

Desde allí podrás visualizar la totalidad de los esquemas, contratos de petición/respuesta y autorizar peticiones con token Bearer (`JWT`) para probar los endpoints protegidos directamente desde el navegador.

---

## 📦 Scripts Disponibles (`package.json`)

| Script | Comando | Descripción |
| :--- | :--- | :--- |
| `npm run dev` | `node --experimental-strip-types --watch src/app.js` | Inicia el servidor en modo desarrollo con reinicio automático. |
| `npm start` | `node --experimental-strip-types src/app.js` | Inicia el servidor para entorno de producción. |
| `npm run docs` | `node generar-docs.js` | Analiza las rutas y actualiza `swagger-output.json`. |
| `npm run seed` | `node prisma/seed.js` | Ejecuta el script SQL de semillas para poblar la base de datos. |
| `npm test` | `node --test test/productos.test.js ...` | Ejecuta las pruebas unitarias principales del proyecto. |
| `npm run test:unitario` | `node --test test/productos.test.js ...` | Ejecuta las pruebas unitarias de esquemas y productos. |
| `npm run test:integracion` | `node --env-file=.env.test ...` | Ejecuta las pruebas de integración con la base de datos de test. |
| `npm run test:flujo-productos` | `node --env-file=.env.test ...` | Prueba el flujo completo del ciclo de vida de productos. |
| `npm run test:flujo-stands` | `node --env-file=.env.test ...` | Prueba el flujo de asignación y liberación de stands. |
| `npm run test:usuarios` | `node --env-file=.env.test ...` | Prueba la integración de registro, login y gestión de usuarios. |
| `npm run db:test:preparar` | `node --env-file=.env.test ...` | Aplica las migraciones de Prisma en la base de datos de test. |

---

## 🌐 Endpoints de la API

### General
| Método | Endpoint | Acceso / Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Público | Mensaje de bienvenida de la API. |
| `GET` | `/info` | Público | Información general, versión y autores de la API. |
| `GET` | `/docs` | Público | Interfaz Swagger UI para exploración interactiva. |

### Autenticación y Perfil (`/usuarios`)
| Método | Endpoint | Acceso / Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/usuarios/registro` | Público | Registra una nueva cuenta de artesano y su solicitud inicial en estado PENDIENTE. |
| `POST` | `/usuarios/login` | Público | Inicia sesión validando credenciales y devuelve el token JWT. |
| `POST` | `/usuarios/logout` | Autenticado | Cierra sesión revocando el token JWT actual en la base de datos. |
| `GET` | `/usuarios/me` | Autenticado | Consulta el perfil completo del usuario en sesión, su rol y estado. |

### Usuarios (`/usuarios`)
| Método | Endpoint | Acceso / Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/usuarios` | `ADMINISTRADOR` | Lista usuarios con paginación y filtros. |
| `POST` | `/usuarios` | `ADMINISTRADOR` | Crea un usuario con rol asignado por el administrador. |
| `GET` | `/usuarios/:id` | `ADMINISTRADOR` o Propio Usuario | Consulta el detalle de un usuario por su UUID. |
| `PATCH` | `/usuarios/:id` | `ADMINISTRADOR` o Propio Usuario | Actualiza datos personales de un usuario. |
| `DELETE` | `/usuarios/:id` | `ADMINISTRADOR` | Elimina una cuenta de usuario. |
| `PATCH` | `/usuarios/:id/activo` | `ADMINISTRADOR` | Activa o desactiva la cuenta de un usuario. |

### Solicitudes de Postulación (`/solicitudes`)
| Método | Endpoint | Acceso / Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/solicitudes/me` | `ARTESANO` | Consulta el estado de mi solicitud de postulación. |
| `POST` | `/solicitudes` | `ARTESANO` | Crea mi solicitud de postulación (si no existía una previa). |
| `PATCH` | `/solicitudes/me` | `ARTESANO` | Modifica datos del emprendimiento postulante. |
| `DELETE` | `/solicitudes/me` | `ARTESANO` | Cancela la solicitud propia de postulación. |
| `GET` | `/solicitudes` | `ADMINISTRADOR`, `ORGANIZADOR` | Lista todas las solicitudes registradas con filtros. |
| `GET` | `/solicitudes/:id` | `ADMINISTRADOR`, `ORGANIZADOR` | Consulta los detalles de una postulación por su ID. |
| `PATCH` | `/solicitudes/:id` | `ADMINISTRADOR`, `ORGANIZADOR` | Actualiza campos de una postulación. |
| `DELETE` | `/solicitudes/:id` | `ADMINISTRADOR` | Elimina físicamente una solicitud. |
| `PATCH` | `/solicitudes/:id/aprobar` | `ADMINISTRADOR`, `ORGANIZADOR` | **Aprueba** la solicitud y activa automáticamente el perfil de artesano. |
| `PATCH` | `/solicitudes/:id/rechazar` | `ADMINISTRADOR`, `ORGANIZADOR` | **Rechaza** la postulación indicando observaciones. |
| `PATCH` | `/solicitudes/:id/solicitar-modificacion` | `ADMINISTRADOR`, `ORGANIZADOR` | Solicita correcciones al artesano sobre su postulación. |

### Artesanos (`/artesanos`)
| Método | Endpoint | Acceso / Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/artesanos` | Público | Lista los artesanos activos con filtros y paginación. |
| `GET` | `/artesanos/me` | `ARTESANO` | Consulta mi perfil de artesano autenticado. |
| `PATCH` | `/artesanos/me` | `ARTESANO` | Actualiza datos de mi perfil de artesano. |
| `GET` | `/artesanos/:id` | Público | Obtiene los datos públicos de un artesano por su ID. |
| `POST` | `/artesanos` | `ADMINISTRADOR`, `ORGANIZADOR` | Registra directamente un artesano en el sistema. |
| `PATCH` | `/artesanos/:id` | `ADMINISTRADOR`, `ORGANIZADOR` | Modifica los datos de un artesano. |
| `DELETE` | `/artesanos/:id` | `ADMINISTRADOR` | Da de baja lógica o elimina un artesano. |

### Productos (`/productos`)
| Método | Endpoint | Acceso / Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/productos` | Público | Consulta el catálogo público de productos artesanales. |
| `GET` | `/productos/me` | `ARTESANO` | Lista todos los productos propios publicados. |
| `GET` | `/productos/:id` | Público | Obtiene el detalle de un producto por ID. |
| `POST` | `/productos` | `ARTESANO` (Habilitado) | Publica un nuevo producto artesanal propio. |
| `PATCH` | `/productos/:id` | `ARTESANO` (Habilitado y Propietario) | Actualiza el precio o nombre de un producto propio. |
| `DELETE` | `/productos/:id` | `ARTESANO` (Habilitado y Propietario) | Elimina un producto propio del catálogo. |

### Stands y Distribución del Predio (`/stands`)
| Método | Endpoint | Acceso / Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/stands` | Público | Lista todos los stands del predio y su estado (`DISPONIBLE`, `OCUPADO`, etc.). |
| `GET` | `/stands/:id` | Público | Obtiene la información y ubicación de un stand específico. |
| `POST` | `/stands` | `ADMINISTRADOR`, `ORGANIZADOR` | Crea un nuevo stand con número y coordenadas planimétricas. |
| `PATCH` | `/stands/:id` | `ADMINISTRADOR`, `ORGANIZADOR` | Actualiza datos del stand. |
| `DELETE` | `/stands/:id` | `ADMINISTRADOR` | Elimina un stand del predio. |
| `POST` | `/stands/asignar` | `ADMINISTRADOR`, `ORGANIZADOR` | Asigna un stand disponible a un artesano activo. |
| `PATCH` | `/stands/:id/liberar` | `ADMINISTRADOR`, `ORGANIZADOR` | Libera un stand previamente ocupado. |

### Pabellones y Sectores (`/pabellones`, `/sectores`)
| Método | Endpoint | Acceso / Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/pabellones` | Público | Lista los pabellones de la feria. |
| `GET` | `/pabellones/:id` | Público | Obtiene los detalles de un pabellón. |
| `POST` | `/pabellones` | `ADMINISTRADOR`, `ORGANIZADOR` | Registra un nuevo pabellón. |
| `PATCH` | `/pabellones/:id` | `ADMINISTRADOR`, `ORGANIZADOR` | Modifica un pabellón. |
| `DELETE` | `/pabellones/:id` | `ADMINISTRADOR` | Elimina un pabellón. |
| `GET` | `/sectores` | Público | Lista los sectores del predio. |
| `GET` | `/sectores/:id` | Público | Obtiene los detalles de un sector por ID. |
| `POST` | `/sectores` | `ADMINISTRADOR`, `ORGANIZADOR` | Crea un nuevo sector asociado a un pabellón/rubro. |
| `PATCH` | `/sectores/:id` | `ADMINISTRADOR`, `ORGANIZADOR` | Modifica los datos de un sector. |
| `DELETE` | `/sectores/:id` | `ADMINISTRADOR` | Elimina un sector. |

### Rubros y Localidades (`/rubros`, `/localidades`)
| Método | Endpoint | Acceso / Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/rubros` | Público | Lista todos los rubros artesanales disponibles (Tejido, Cerámica, Cuero, etc.). |
| `GET` | `/rubros/:id` | Público | Detalle de un rubro específico. |
| `POST` | `/rubros` | `ADMINISTRADOR`, `ORGANIZADOR` | Registra un nuevo rubro artesanal. |
| `PATCH` | `/rubros/:id` | `ADMINISTRADOR`, `ORGANIZADOR` | Actualiza el nombre de un rubro. |
| `DELETE` | `/rubros/:id` | `ADMINISTRADOR` | Elimina un rubro del sistema. |
| `GET` | `/localidades` | Público | Lista las localidades con paginación, filtros y ordenamiento. |
| `GET` | `/localidades/:id` | Público | Obtiene el detalle de una localidad por ID. |
| `POST` | `/localidades` | `ADMINISTRADOR`, `ORGANIZADOR` | Registra una nueva localidad. |
| `PUT` / `PATCH` | `/localidades/:id` | `ADMINISTRADOR`, `ORGANIZADOR` | Actualiza los datos de una localidad. |
| `DELETE` | `/localidades/:id` | `ADMINISTRADOR` | Elimina una localidad (si no posee usuarios asociados). |

### Roles del Sistema (`/roles`)
| Método | Endpoint | Acceso / Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/roles` | `ADMINISTRADOR` | Lista los roles del sistema. |
| `POST` | `/roles` | `ADMINISTRADOR` | Crea un nuevo rol. |
| `GET` | `/roles/:id` | `ADMINISTRADOR` | Consulta un rol por ID. |
| `PATCH` | `/roles/:id` | `ADMINISTRADOR` | Actualiza la información de un rol. |
| `DELETE` | `/roles/:id` | `ADMINISTRADOR` | Elimina un rol. |

### Búsquedas y Métricas (`/busquedas`)
| Método | Endpoint | Acceso / Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/busquedas` | Público / Autenticado | Registra un evento de búsqueda con filtros aplicados (localidad, rubro, pabellón). |
| `GET` | `/busquedas` | `ADMINISTRADOR`, `ORGANIZADOR` | Consulta el registro histórico de búsquedas con paginación. |
| `GET` | `/busquedas/:id` | `ADMINISTRADOR`, `ORGANIZADOR` | Consulta un evento de búsqueda por su ID. |
| `DELETE` | `/busquedas/:id` | `ADMINISTRADOR` | Elimina un registro de búsqueda del histórico. |

---

## 🗂️ Estructura del Proyecto

```text
poncho-digital-backend/
├── api-test/                     # Colecciones de peticiones HTTP (.http) para REST Client
│   ├── busquedas.http
│   ├── flujoArtesano.http        # Flujo e2e: registro, postulación y consulta
│   ├── flujoAsignacionStands.http# Flujo e2e: asignación y liberación de stands
│   ├── flujoProductos.http       # Flujo e2e: publicación de productos y control de permisos
│   ├── login.http
│   └── ...
├── prisma/                       # Capa de base de datos con Prisma ORM
│   ├── migrations/               # Historial de migraciones SQL aplicadas
│   ├── schema.prisma             # Modelo de datos, relaciones y enums
│   ├── seed.js                   # Script ejecutor de semillas iniciales
│   └── seed.sql                  # Sentencias SQL para poblar datos base
├── scripts/                      # Scripts de utilidad
│   └── inicializar-admin.js      # Creación de usuario administrador inicial
├── src/                          # Código fuente de la aplicación
│   ├── config/                   # Configuraciones (Prisma Client, JWT)
│   ├── controllers/              # Controladores de peticiones y respuestas HTTP
│   ├── documentacion/            # Esquemas base para el contrato OpenAPI
│   ├── generated/                # Cliente generado por Prisma
│   ├── middlewares/              # Middlewares organizados por responsabilidad
│   │   ├── auth/                 # Autenticación JWT, RBAC y verificación de estado
│   │   ├── base/                 # Validadores genéricos de IDs y esquemas
│   │   ├── global/               # Logger, 404 y manejador centralizado de errores
│   │   └── validation/           # Middlewares de validación específicos por recurso
│   ├── routes/                   # Definición de rutas y endpoints de Express
│   ├── services/                 # Capa de lógica de negocio y persistencia
│   ├── tareas/                   # Tareas programadas en background (limpieza de tokens)
│   ├── utils/                    # Funciones utilitarias y formateadores de error
│   ├── validators/               # Definición de esquemas de validación Zod
│   └── app.js                    # Configuración principal de Express y arranque
├── test/                         # Suite de pruebas automatizadas
│   ├── helpers/                  # Utilidades para preparación y limpieza de base en tests
│   ├── productos.test.js         # Pruebas unitarias de autorización en endpoints
│   ├── productos-schema.test.js  # Pruebas unitarias de esquemas Zod
│   ├── productos-integracion.test.js
│   ├── flujo-productos.test.js   # Pruebas de integración del flujo de productos
│   ├── flujo-stands.test.js      # Pruebas de integración del flujo de stands
│   └── usuarios-integracion.test.js
├── .env.example                  # Plantilla de variables de entorno para desarrollo
├── .env.test.example             # Plantilla de variables de entorno para pruebas
├── generar-docs.js               # Script para autogenerar la documentación OpenAPI
├── swagger-output.json           # Especificación OpenAPI 3.0 generada
├── package.json                  # Dependencias y scripts del proyecto
└── README.md                     # Documentación general del proyecto
```

---

## 🧪 Pruebas del Sistema

### Pruebas Automatizadas con Node.js Test Runner
El proyecto incluye tests unitarios y de integración:
```bash
# Ejecutar pruebas unitarias de esquemas y productos
npm run test:unitario

# Ejecutar pruebas de integración de usuarios
npm run test:usuarios

# Ejecutar pruebas de integración de flujos
npm run test:flujo-productos
npm run test:flujo-stands
```

### Pruebas Manuales con Archivos `.http`
En la carpeta `api-test/` se encuentran scripts listos para ser ejecutados utilizando la extensión **REST Client** de Visual Studio Code o herramientas similares. Permiten simular tanto endpoints individuales como flujos completos de usuario (registro, aprobación, carga de catálogo, asignación de stand y logout).
