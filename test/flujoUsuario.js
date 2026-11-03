/**
 * Prueba de integración automatizada para la Unidad 4:
 * Autorización, Roles, Propiedad de Recursos y Gestión de Cuentas.
 * Recorre los 8 criterios de evaluación e incluye limpieza (teardown) automática.
 *
 * Ejecución:
 *   npm run test:flujo
 *   (o: node --env-file=.env test/flujoUsuario.js)
 */

import "dotenv/config";

const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

const assertStatus = async (res, esperado, descripcion) => {
  let body = null;
  const text = await res.text();
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (res.status !== esperado) {
    throw new Error(
      `${descripcion} -> Esperado HTTP ${esperado}, recibido HTTP ${res.status}: ${JSON.stringify(body)}`
    );
  }
  console.log(`✔ [HTTP ${res.status}] ${descripcion}`);
  return body;
};

async function ejecutarFlujo() {
  console.log("=================================================================");
  console.log(`Iniciando prueba de integración Unidad 4 en ${baseUrl}...`);
  console.log("=================================================================\n");

  const sufijoAleatorio = Math.floor(100000 + Math.random() * 900000);
  const dni = `${30000000 + Math.floor(Math.random() * 9000000)}`;
  const email = `florencia.${sufijoAleatorio}@gmail.com`;

  let idUsuario = null;
  let idSolicitud = null;
  let idArtesano = null;
  let idStand = null;
  let idProducto = null;
  let tokenArtesano = null;
  let tokenAdmin = null;
  let idAdmin = null;

  try {
    // -------------------------------------------------------------------------
    // PASO 1: Postulación pública (Criterio 6)
    // -------------------------------------------------------------------------
    console.log("--- PASO 1: Postulación pública (Usuario + Artesano INACTIVO + Solicitud PENDIENTE) ---");
    const resRegistro = await fetch(`${baseUrl}/usuarios/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: "Florencia",
        apellido: "Navarro",
        dni,
        email,
        telefono: "3834123456",
        password: "PonchoSeguro2026.",
        localidadId: 1,
        rubroId: 1,
        nombre_emprendimiento: `Tejidos Navarro ${sufijoAleatorio}`,
        descripcion_emprendimiento:
          "Ponchos catamarqueños tradicionales tejidos en telar criollo de vicuña",
      }),
    });

    const dataRegistro = await assertStatus(
      resRegistro,
      201,
      "Postulación pública crea cuenta, Artesano INACTIVO y Solicitud PENDIENTE"
    );
    idUsuario = dataRegistro.id_usuario;
    idArtesano = dataRegistro.artesano?.id_artesano;
    idSolicitud = dataRegistro.solicitud?.id_solicitud;

    if (
      dataRegistro.artesano?.estado !== "INACTIVO" ||
      dataRegistro.solicitud?.estado_solicitud !== "PENDIENTE"
    ) {
      throw new Error(
        `Estados iniciales inesperados: artesano=${dataRegistro.artesano?.estado}, solicitud=${dataRegistro.solicitud?.estado_solicitud}`
      );
    }

    // -------------------------------------------------------------------------
    // PASO 2: Login del postulante y Contexto de la cuenta (Criterio 2)
    // -------------------------------------------------------------------------
    console.log("\n--- PASO 2: Login del postulante y consulta de /usuarios/me ---");
    const resLoginArt = await fetch(`${baseUrl}/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: "PonchoSeguro2026." }),
    });
    const dataLoginArt = await assertStatus(resLoginArt, 200, "Login de postulante exitoso");
    tokenArtesano = dataLoginArt.token;

    const resMe = await fetch(`${baseUrl}/usuarios/me`, {
      headers: { Authorization: `Bearer ${tokenArtesano}` },
    });
    const dataMe = await assertStatus(
      resMe,
      200,
      "GET /usuarios/me devuelve contexto con rol y estado vigentes"
    );
    if (dataMe.usuario?.activo !== true || dataMe.usuario?.rol !== "ARTESANO") {
      throw new Error(`Contexto de usuario inválido: ${JSON.stringify(dataMe)}`);
    }

    // -------------------------------------------------------------------------
    // PASO 3: Bloqueo mientras está PENDIENTE y control de roles (Criterios 3, 4 y 6)
    // -------------------------------------------------------------------------
    console.log("\n--- PASO 3: Restricciones mientras la solicitud está PENDIENTE y control de roles ---");
    const resProdBloqueado = await fetch(`${baseUrl}/productos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenArtesano}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre_producto: "Poncho bloqueado", precio: 90000 }),
    });
    await assertStatus(
      resProdBloqueado,
      403,
      "Mientras la solicitud está PENDIENTE, la cuenta NO opera productos (403)"
    );

    const resAprobarPropio = await fetch(`${baseUrl}/solicitudes/${idSolicitud}/aprobar`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokenArtesano}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    await assertStatus(
      resAprobarPropio,
      403,
      "ARTESANO no puede aprobar solicitudes (403 antes de validar body)"
    );

    const resSinToken = await fetch(`${baseUrl}/solicitudes`);
    await assertStatus(resSinToken, 401, "Ruta protegida sin token responde 401");

    // -------------------------------------------------------------------------
    // PASO 4: Login del Administrador y habilitación del Artesano (Criterios 4 y 6)
    // -------------------------------------------------------------------------
    console.log("\n--- PASO 4: Aprobación por Administrador y validación de re-resolución (409) ---");
    const resLoginAdmin = await fetch(`${baseUrl}/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@ponchodigital.com",
        password: "AdminPoncho2026!",
      }),
    });
    const dataLoginAdmin = await assertStatus(resLoginAdmin, 200, "Login de ADMINISTRADOR exitoso");
    tokenAdmin = dataLoginAdmin.token;
    idAdmin = dataLoginAdmin.usuario?.id_usuario;

    const resAprobar = await fetch(`${baseUrl}/solicitudes/${idSolicitud}/aprobar`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        observaciones_admin: "Documentación verificada y piezas auténticas.",
      }),
    });
    const dataAprobar = await assertStatus(
      resAprobar,
      200,
      "Admin aprueba solicitud -> pasa a APROBADO y habilita Artesano ACTIVO"
    );
    if (dataAprobar.artesano?.estado !== "ACTIVO") {
      throw new Error("El artesano no quedó en estado ACTIVO tras aprobar la solicitud");
    }

    const resReResolver = await fetch(`${baseUrl}/solicitudes/${idSolicitud}/rechazar`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        observaciones_admin: "Intento de rechazar solicitud ya resuelta.",
      }),
    });
    await assertStatus(
      resReResolver,
      409,
      "Intentar resolver una solicitud ya resuelta responde 409 Conflict"
    );

    // -------------------------------------------------------------------------
    // PASO 5: Asignación de Stand por el Administrador (Criterio 4)
    // -------------------------------------------------------------------------
    console.log("\n--- PASO 5: Asignación de Stand y consulta de /artesanos/me ---");
    const resAsignar = await fetch(`${baseUrl}/stands/asignar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ artesanoId: idArtesano }),
    });
    const dataAsignar = await assertStatus(
      resAsignar,
      200,
      "Admin asigna Stand disponible al artesano"
    );
    idStand = dataAsignar.id_stand;

    const resMiArtesano = await fetch(`${baseUrl}/artesanos/me`, {
      headers: { Authorization: `Bearer ${tokenArtesano}` },
    });
    await assertStatus(
      resMiArtesano,
      200,
      "GET /artesanos/me devuelve el perfil propio con su Stand asignado"
    );

    // -------------------------------------------------------------------------
    // PASO 6: Propiedad de los Productos (Criterios 5 y 8)
    // -------------------------------------------------------------------------
    console.log("\n--- PASO 6: Propiedad de los Productos (Alta, Listado /me, Modificación y 404 en ajenos) ---");
    const resCrearProd = await fetch(`${baseUrl}/productos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenArtesano}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre_producto: "Poncho de vicuña tradicional",
        precio: 150000,
      }),
    });
    const dataCrearProd = await assertStatus(
      resCrearProd,
      201,
      "Artesano habilitado crea producto propio sin enviar artesanoId"
    );
    idProducto = dataCrearProd.id_producto;

    const resProdConArtesanoId = await fetch(`${baseUrl}/productos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenArtesano}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre_producto: "Producto inválido",
        precio: 50000,
        artesanoId: 1,
      }),
    });
    await assertStatus(
      resProdConArtesanoId,
      400,
      "Enviar artesanoId en el body es rechazado con 400 Bad Request"
    );

    const resMisProductos = await fetch(`${baseUrl}/productos/me`, {
      headers: { Authorization: `Bearer ${tokenArtesano}` },
    });
    const dataMisProductos = await assertStatus(
      resMisProductos,
      200,
      "GET /productos/me lista únicamente los productos del artesano autenticado"
    );
    if (!Array.isArray(dataMisProductos) || dataMisProductos.length !== 1) {
      throw new Error(`Se esperaba 1 producto propio, recibido: ${JSON.stringify(dataMisProductos)}`);
    }

    const resPatchPropio = await fetch(`${baseUrl}/productos/${idProducto}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokenArtesano}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ precio: 165000 }),
    });
    await assertStatus(
      resPatchPropio,
      200,
      "Modificar producto propio (filtrando por id y propietario en where) responde 200"
    );

    const resPatchAjeno = await fetch(`${baseUrl}/productos/999999`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokenArtesano}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ precio: 10000 }),
    });
    await assertStatus(
      resPatchAjeno,
      404,
      "Modificar producto ajeno o inexistente responde 404 (P2025 traducido por manejador)"
    );

    // -------------------------------------------------------------------------
    // PASO 7: Gestión de cuentas y estado activo (Criterios 2 y 7)
    // -------------------------------------------------------------------------
    console.log("\n--- PASO 7: Gestión de cuentas (PATCH /usuarios/:id/activo y último admin 409) ---");
    const resDesactivarUltimoAdmin = await fetch(`${baseUrl}/usuarios/${idAdmin}/activo`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ activo: false }),
    });
    await assertStatus(
      resDesactivarUltimoAdmin,
      409,
      "Intentar desactivar al último administrador activo responde 409 Conflict"
    );

    const resDesactivarArt = await fetch(`${baseUrl}/usuarios/${idUsuario}/activo`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ activo: false }),
    });
    await assertStatus(resDesactivarArt, 200, "Admin desactiva la cuenta de la artesana (200)");

    const resMeInactiva = await fetch(`${baseUrl}/usuarios/me`, {
      headers: { Authorization: `Bearer ${tokenArtesano}` },
    });
    await assertStatus(
      resMeInactiva,
      403,
      "Cuenta desactivada con token vigente recibe 403 Forbidden"
    );

    const resLoginInactiva = await fetch(`${baseUrl}/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: "PonchoSeguro2026." }),
    });
    await assertStatus(
      resLoginInactiva,
      401,
      "Login de cuenta desactivada recibe 401 con mensaje genérico"
    );

    const resReactivarArt = await fetch(`${baseUrl}/usuarios/${idUsuario}/activo`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokenAdmin}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ activo: true }),
    });
    await assertStatus(resReactivarArt, 200, "Admin reactiva la cuenta de la artesana (200)");

    const resMeReactivada = await fetch(`${baseUrl}/usuarios/me`, {
      headers: { Authorization: `Bearer ${tokenArtesano}` },
    });
    await assertStatus(
      resMeReactivada,
      200,
      "Cuenta reactivada vuelve a operar con su token vigente (200)"
    );

    console.log("\n=================================================================");
    console.log("¡TODOS LOS 8 CRITERIOS DE EVALUACIÓN VALIDADOS EXITOSAMENTE!");
    console.log("=================================================================");
  } catch (error) {
    console.error(`\n❌ Error en la prueba de integración: ${error.message}`);
    process.exitCode = 1;
  } finally {
    // -------------------------------------------------------------------------
    // PASO 8: Teardown / Limpieza
    // -------------------------------------------------------------------------
    console.log("\nIniciando limpieza (teardown) de datos de prueba...");

    if (idProducto && tokenArtesano) {
      try {
        const resDelProd = await fetch(`${baseUrl}/productos/${idProducto}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${tokenArtesano}` },
        });
        if (resDelProd.status === 204) {
          console.log(`- Producto ID ${idProducto} eliminado por su propietaria (204).`);
        }
      } catch (err) {
        console.error(`- Error al eliminar producto ID ${idProducto}: ${err.message}`);
      }
    }

    if (idStand && tokenAdmin) {
      try {
        const resLiberar = await fetch(`${baseUrl}/stands/${idStand}/liberar`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${tokenAdmin}` },
        });
        if (resLiberar.ok) {
          console.log(`- Stand ID ${idStand} liberado (vuelto a DISPONIBLE).`);
        }
      } catch (err) {
        console.error(`- Error al liberar stand ID ${idStand}: ${err.message}`);
      }
    }

    if (idUsuario && tokenAdmin) {
      try {
        const resEliminarUser = await fetch(`${baseUrl}/usuarios/${idUsuario}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${tokenAdmin}` },
        });
        if (resEliminarUser.ok) {
          console.log(`- Usuario de prueba (${idUsuario}) eliminado correctamente.`);
        }
      } catch (err) {
        console.error(`- Error al eliminar usuario ID ${idUsuario}: ${err.message}`);
      }
    }

    console.log("Limpieza completada. Base de datos restaurada.");
  }
}

ejecutarFlujo();
