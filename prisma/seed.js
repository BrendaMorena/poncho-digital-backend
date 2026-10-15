import "dotenv/config";
import fs from "fs";
import path from "path";
import pg from "pg";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error("No se encontró DIRECT_URL o DATABASE_URL en las variables de entorno.");
  process.exit(1);
}

const client = new pg.Client({
  connectionString
});

async function runSeed() {
  try {
    console.log("Conectando a la base de datos PostgreSQL...");
    await client.connect();
    console.log("Conexión establecida.");

    const sqlPath = path.join(__dirname, "seed.sql");
    console.log(`Leyendo script: ${sqlPath}...`);
    const sql = fs.readFileSync(sqlPath, "utf8");

    console.log("Ejecutando inserción de semillas...");
    await client.query(sql);

    console.log("Semillas cargadas exitosamente en la base de datos");
    console.log("   - Roles cargados (ADMINISTRADOR, ORGANIZADOR, USUARIO)");
    console.log("   - 166 Localidades de Catamarca cargadas");
    console.log("   - 9 Rubros cargados");
    console.log("   - 5 Pabellones cargados");
    console.log("   - 9 Sectores cargados");
    console.log("   - 20 Stands cargados");
    console.log("   - Usuarios base cargados (admin@ponchodigital.com y usuario.test@gmail.com)");
  } catch (error) {
    console.error("Error ejecutando las semillas:", error);
  } finally {
    await client.end();
  }
}

runSeed();
