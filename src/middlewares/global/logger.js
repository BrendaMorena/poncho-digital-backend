// ============================================================================
// LOGGER ORIGINAL (Comentado temporalmente para el TP de Rendimiento)
// ============================================================================
// export const logger = (req, res, next) => {
//     const inicio = Date.now();
// 
//     res.on('finish', () => {
//         const ms = Date.now() - inicio;
//         console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${ms}ms`);
//     });
// 
//     next();
// };

// ============================================================================
// LOGGER CON MÉTRICAS DE RENDIMIENTO (Tiempo de alta precisión y Tamaño en B / KB)
// ============================================================================
export const logger = (req, res, next) => {
    const inicio = process.hrtime.bigint();
    let bytesEnviados = 0;

    // Capturar bytes enviados en caso de que no haya header content-length explícito
    const originalWrite = res.write;
    const originalEnd = res.end;

    res.write = function (chunk, ...args) {
        if (chunk) {
            bytesEnviados += Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(chunk);
        }
        return originalWrite.apply(res, [chunk, ...args]);
    };

    res.end = function (chunk, ...args) {
        if (chunk) {
            bytesEnviados += Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(chunk);
        }
        return originalEnd.apply(res, [chunk, ...args]);
    };

    res.on('finish', () => {
        const fin = process.hrtime.bigint();
        const duracionMs = (Number(fin - inicio) / 1_000_000).toFixed(2);
        
        // Obtener tamaño desde el header o desde los chunks calculados
        const totalBytes = Number(res.getHeader('content-length')) || bytesEnviados;
        const formatoTamano = totalBytes < 1024 
            ? `${totalBytes} B` 
            : `${(totalBytes / 1024).toFixed(2)} KB`;

        console.log(`[PERF] ${req.method} ${req.originalUrl} -> ${res.statusCode} | ${duracionMs} ms | ${formatoTamano}`);
    });

    next();
};
