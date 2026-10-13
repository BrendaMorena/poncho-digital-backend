/**
 * Test automatizado del flujo de postulacion y aprobacion de artesano.
 * Incluye limpieza (teardown) para garantizar idempotencia.
 *
 * Ejecucion:
 *   node test/flujoUsuario.js
 */

const baseUrl = process.env.BASE_URL;

async function ejecutarFlujo() {
  console.log("Iniciando prueba de integracion...");

  const sufijoAleatorio = Math.floor(100000 + Math.random() * 900000);
  const dni = `${30000000 + Math.floor(Math.random() * 9000000)}`;
  const email = `test.flujo.${sufijoAleatorio}@gmail.com`;

  let idUsuario = null;
  let idSolicitud = null;
  let idArtesano = null;
  let idStand = null;

  try {
    // 1. Registro del usuario postulante
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
        descripcion_emprendimiento: "Ponchos catamarquenos tradicionales tejidos en telar criollo de vicuna"
      }),
    });

    if (resRegistro.status !== 201) {
      const err = await resRegistro.json();
      throw new Error(`Fallo en registro (HTTP ${resRegistro.status}): ${JSON.stringify(err)}`);
    }

    const dataRegistro = await resRegistro.json();
    idUsuario = dataRegistro.id_usuario;
    idSolicitud = dataRegistro.solicitud?.id_solicitud;
    console.log(`[Paso 1] Usuario registrado (ID: ${idUsuario}) y solicitud creada (ID: ${idSolicitud})`);

    // 2. Consulta de solicitud recien creada
    const resSolicitud = await fetch(`${baseUrl}/solicitudes/${idSolicitud}`);
    if (!resSolicitud.ok) throw new Error(`Fallo al consultar solicitud (HTTP ${resSolicitud.status})`);
    const dataSolicitud = await resSolicitud.json();

    if (dataSolicitud.estado_solicitud !== "PENDIENTE") {
      throw new Error(`Estado inicial incorrecto: esperado PENDIENTE, recibido ${dataSolicitud.estado_solicitud}`);
    }
    console.log(`[Paso 2] Solicitud consultada. Estado inicial confirmado: PENDIENTE`);

    // 3. Administrador consulta lista de solicitudes pendientes
    const resPendientes = await fetch(`${baseUrl}/solicitudes?estado_solicitud=PENDIENTE`);
    if (!resPendientes.ok) throw new Error(`Fallo al consultar solicitudes pendientes (HTTP ${resPendientes.status})`);
    const dataPendientes = await resPendientes.json();
    const existePendiente = dataPendientes.solicitudes?.some((s) => s.id_solicitud === idSolicitud);

    if (!existePendiente) {
      throw new Error(`La solicitud ${idSolicitud} no fue encontrada en la lista de pendientes`);
    }
    console.log(`[Paso 3] Lista de pendientes consultada por admin. Solicitud verificada en la lista.`);

    // 4. Administrador aprueba solicitud (genera artesano ACTIVO)
    const resAprobar = await fetch(`${baseUrl}/solicitudes/${idSolicitud}/aprobar`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        observaciones_admin: "Documentacion verificada y piezas autenticas para la Fiesta del Poncho."
      }),
    });

    if (!resAprobar.ok) {
      const err = await resAprobar.json();
      throw new Error(`Fallo al aprobar solicitud (HTTP ${resAprobar.status}): ${JSON.stringify(err)}`);
    }

    const dataAprobar = await resAprobar.json();
    idArtesano = dataAprobar.artesano?.id_artesano;
    console.log(`[Paso 4] Solicitud aprobada. Artesano creado (ID: ${idArtesano}, Estado: ${dataAprobar.artesano?.estado})`);

    // 5. Asignacion automatica de Stand por Rubro
    const resAsignar = await fetch(`${baseUrl}/stands/asignar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artesanoId: idArtesano }),
    });

    if (!resAsignar.ok) {
      const err = await resAsignar.json();
      throw new Error(`Fallo al asignar stand (HTTP ${resAsignar.status}): ${JSON.stringify(err)}`);
    }

    const dataAsignar = await resAsignar.json();
    idStand = dataAsignar.id_stand;
    console.log(`[Paso 5] Stand asignado automaticamente: Stand N° ${dataAsignar.numero_stand} (ID: ${idStand}, Estado: OCUPADO)`);

    // 6. Verificacion de solicitud con estado APROBADO
    const resVerifSol = await fetch(`${baseUrl}/solicitudes/${idSolicitud}`);
    const dataVerifSol = await resVerifSol.json();
    if (dataVerifSol.estado_solicitud !== "APROBADO") {
      throw new Error(`Estado final incorrecto en solicitud: esperado APROBADO, recibido ${dataVerifSol.estado_solicitud}`);
    }
    console.log(`[Paso 6] Solicitud re-verificada con estado: APROBADO`);

    // 7. Verificacion del artesano y su stand asignado
    const resVerifArt = await fetch(`${baseUrl}/artesanos/${idArtesano}`);
    const dataVerifArt = await resVerifArt.json();
    if (dataVerifArt.estado !== "ACTIVO" || !dataVerifArt.stand) {
      throw new Error(`El artesano no registra estado ACTIVO o no tiene stand asociado`);
    }
    console.log(`[Paso 7] Artesano re-verificado: ACTIVO con stand N° ${dataVerifArt.stand.numero_stand}`);

    console.log("Flujo principal validado correctamente.");
  } catch (error) {
    console.error(`Error en la prueba: ${error.message}`);
    process.exitCode = 1;
  } finally {
    // Teardown: Limpieza para restaurar el estado previo de la base de datos
    console.log("Iniciando limpieza de datos de prueba...");

    if (idStand) {
      try {
        const resLiberar = await fetch(`${baseUrl}/stands/${idStand}/liberar`, { method: "PATCH" });
        if (resLiberar.ok) {
          console.log(`- Stand ID ${idStand} liberado (vuelto a DISPONIBLE).`);
        }
      } catch (err) {
        console.error(`- Error al liberar stand ID ${idStand}: ${err.message}`);
      }
    }

    if (idUsuario) {
      try {
        const resEliminarUser = await fetch(`${baseUrl}/usuarios/${idUsuario}`, { method: "DELETE" });
        if (resEliminarUser.ok) {
          console.log(`- Usuario de prueba eliminado (cascada: solicitud y artesano eliminados).`);
        }
      } catch (err) {
        console.error(`- Error al eliminar usuario ID ${idUsuario}: ${err.message}`);
      }
    }

    console.log("Limpieza completada. Base de datos restaurada.");
  }
}

ejecutarFlujo();
