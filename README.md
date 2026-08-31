# API PONCHO DIGITAL - FERIA ARTESANAL

Sistema backend para gestionar artesanos, productos y stands de una feria artesanal digital. Esta API proporciona endpoints para consultar información de artesanos locales, explorar sus productos artesanales y visualizar la distribución de stands en el predio.

---

## Integrantes
- [Aguero-Velez], [Lucas-Gabriel], [MUN°-00426] 
- [Barrionuevo], [Brenda-Morena], [MUN°-00059]
- [Reyna], [Sebastian-Raul], [MUN°-00354]

## Tecnologías

- **Node.js** 24 LTS
- **Express.js** (Framework web)
- **JavaScript/ES6+**
- **npm** (Gestor de paquetes)

## Requisitos

- Node.js v24 o superior
- npm v10 o superior
- Git para control de versiones

## Instalación
npm install

## Ejecución
npm run dev

## Endpoints
| Método | Ruta | Descripción |
|---------|------|--------------|
| GET     | /artesanos | Lista todos los artesanos registrados | 
| GET     | /artesanos/:id | Muestra la información de un artesano específico | 
| POST    | /artesanos | Registra un nuevo artesano en el sistema | 
| GET     | /productos | Lista todos los productos artesanales publicados | 
| POST    | /productos | Agrega un nuevo producto al catálogo |
| GET     | /stands    | Muestra la ubicación de los stands en el predio |

---

## Comando de Git de ayuda para crear el repositorio 
-git init
-git add .
-git commit -m "feat: API inicial con CRUD en memoria"

## Crear el repositorio remoto en GitHub y conectarlo
-git remote add origin <https://github.com/BrendaMorena/poncho-digital-backend.git>
-git branch -M main
-git push -u origin main

---

## Estructura del proyecto
```text
poncho-digital-backend/
├── node_modules/        
├── src/
│   ├── controllers/     (Manejan el req y res de cada petición)
│   ├── middlewares/     (Validaciones y manejo de errores)
│   ├── routes/          (Definen las URLs de los endpoints)
│   ├── services/        (Lógica de negocio y los arreglos en memoria por ahora)
│   └── app.js           (Archivo principal que levanta el servidor)
├── .gitignore           
├── package.json         (Configuración del proyecto y dependencias)
└── README.md            
