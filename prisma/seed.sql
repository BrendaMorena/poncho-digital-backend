-- ============================================================
-- SCRIPT COMPLETO DE SEMILLA / DATOS INICIALES (PONCHO DIGITAL)
-- ============================================================

-- ============================================================
-- 1. ROLES DEL SISTEMA (Requeridos por middlewares y servicios)
-- ============================================================
INSERT INTO "Rol" ("id_rol", "nombre", "descripcion", "updatedAt") VALUES
(1, 'ADMINISTRADOR', 'Acceso total y configuración del sistema', NOW()),
(2, 'ORGANIZADOR',   'Gestión de stands, artesanos y logística', NOW()),
(3, 'ARTESANO',       'Postulante para participar en el evento', NOW())
ON CONFLICT ("nombre") DO NOTHING;

SELECT setval(pg_get_serial_sequence('"Rol"', 'id_rol'), coalesce(max("id_rol"), 1)) FROM "Rol";

-- ============================================================
-- 2. LOCALIDADES DE CATAMARCA (10 Localidades principales)
-- ============================================================
INSERT INTO "Localidad" ("id_localidad", "nombre_locacion", "updatedAt") VALUES
(1, 'San Fernando del Valle de Catamarca', NOW()),
(2, 'Valle Viejo',                          NOW()),
(3, 'Fray Mamerto Esquiú',                  NOW()),
(4, 'Belén',                                NOW()),
(5, 'Tinogasta',                            NOW()),
(6, 'Santa María',                          NOW()),
(7, 'Andalgalá',                            NOW()),
(8, 'Pomán',                                NOW()),
(9, 'Antofagasta de la Sierra',             NOW()),
(10, 'Fiambalá',                            NOW())
ON CONFLICT ("nombre_locacion") DO NOTHING;

SELECT setval(pg_get_serial_sequence('"Localidad"', 'id_localidad'), coalesce(max("id_localidad"), 1)) FROM "Localidad";

-- ============================================================
-- 3. RUBROS ARTESANALES Y TEMÁTICOS
-- ============================================================
INSERT INTO "Rubro" ("nombre_rubro", "updatedAt") VALUES
('Textil',               NOW()),
('Cerámica',             NOW()),
('Madera',               NOW()),
('Metal y Orfebrería',   NOW()),
('Cestería',             NOW()),
('Cuero',                NOW()),
('Manualidades',         NOW()),
('Productos Regionales', NOW()),
('Gastronomía',          NOW())
ON CONFLICT ("nombre_rubro") DO NOTHING;

-- ============================================================
-- 4. PABELLONES OFICIALES PONCHO 2026
-- ============================================================
INSERT INTO "Pabellon" ("nombre_pabellon", "descripcion_pabellon", "updatedAt") VALUES
('Pabellón de Artesanías 1', 'Pabellón histórico de artesanías tradicionales del Poncho', NOW()),
('Pabellón de Artesanías 2', 'Exposición de artesanos contemporáneos y manualidades',     NOW()),
('Pabellón Turismo',         'Espacio federal de municipios y promoción turística',        NOW()),
('Pabellón de Alfombras',   'Muestra y venta de alfombras tradicionales a telar',         NOW()),
('Mercado Cultural',        'Espacio para diseñadores independientes y arte local',        NOW())
ON CONFLICT ("nombre_pabellon") DO NOTHING;

-- ============================================================
-- 5. SECTORES VINCULADOS CON SU RESPECTIVO RUBRO
-- ============================================================
INSERT INTO "Sector" ("codigo_sector", "nombre_sector", "pabellonId", "rubroId", "updatedAt") VALUES
('ART1',  'Sector Tradicional y Textiles', 
    1, (SELECT "id_rubro" FROM "Rubro" WHERE "nombre_rubro" = 'Textil' LIMIT 1), NOW()),

('ART2',  'Sector Metales y Cerámica',     
    2, (SELECT "id_rubro" FROM "Rubro" WHERE "nombre_rubro" = 'Cerámica' LIMIT 1), NOW()),

('MAN',   'Sector Manualidades',           
    2, (SELECT "id_rubro" FROM "Rubro" WHERE "nombre_rubro" = 'Manualidades' LIMIT 1), NOW()),

('TUR',   'Sector Municipios de Catamarca', 
    3, NULL, NOW()),

('ALF',   'Sector Fábrica de Alfombras',   
    4, (SELECT "id_rubro" FROM "Rubro" WHERE "nombre_rubro" = 'Textil' LIMIT 1), NOW()),

('CULT',  'Sector Diseño y Editoriales',   
    5, (SELECT "id_rubro" FROM "Rubro" WHERE "nombre_rubro" = 'Manualidades' LIMIT 1), NOW()),

('REG',   'Sector Productos Regionales y Delicatessen', 
    NULL, (SELECT "id_rubro" FROM "Rubro" WHERE "nombre_rubro" = 'Productos Regionales' LIMIT 1), NOW()),

('VERDE', 'Sector Feria Verde y Viveros',               
    NULL, NULL, NOW()),

('FOOD',  'Zona Foodtrucks y Gastronomía',              
    NULL, (SELECT "id_rubro" FROM "Rubro" WHERE "nombre_rubro" = 'Gastronomía' LIMIT 1), NOW())

ON CONFLICT ("codigo_sector") DO UPDATE 
SET "rubroId"       = EXCLUDED."rubroId",
    "pabellonId"    = EXCLUDED."pabellonId",
    "nombre_sector" = EXCLUDED."nombre_sector",
    "updatedAt"     = NOW();

-- ============================================================
-- 6. STANDS (20 Stands del predio)
-- ============================================================
INSERT INTO "Stand" ("numero_stand", "estado", "coordenada", "sectorId", "updatedAt") VALUES
(1,  'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4682, "lng": -65.7791}'::json, 1, NOW()),
(2,  'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4684, "lng": -65.7793}'::json, 1, NOW()),
(3,  'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4686, "lng": -65.7795}'::json, 1, NOW()),
(4,  'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4690, "lng": -65.7800}'::json, 2, NOW()),
(5,  'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4691, "lng": -65.7801}'::json, 2, NOW()),
(6,  'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4692, "lng": -65.7802}'::json, 3, NOW()),
(7,  'MANTENIMIENTO'::"EstadoStand", '{"lat": -28.4694, "lng": -65.7804}'::json, 3, NOW()),
(8,  'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4701, "lng": -65.7808}'::json, 4, NOW()),
(9,  'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4703, "lng": -65.7810}'::json, 4, NOW()),
(10, 'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4689, "lng": -65.7785}'::json, 5, NOW()),
(11, 'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4690, "lng": -65.7787}'::json, 5, NOW()),
(12, 'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4708, "lng": -65.7798}'::json, 6, NOW()),
(13, 'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4710, "lng": -65.7800}'::json, 6, NOW()),
(14, 'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4678, "lng": -65.7812}'::json, 7, NOW()),
(15, 'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4680, "lng": -65.7814}'::json, 7, NOW()),
(16, 'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4665, "lng": -65.7820}'::json, 8, NOW()),
(17, 'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4667, "lng": -65.7822}'::json, 8, NOW()),
(18, 'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4715, "lng": -65.7825}'::json, 9, NOW()),
(19, 'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4718, "lng": -65.7828}'::json, 9, NOW()),
(20, 'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4720, "lng": -65.7830}'::json, 9, NOW())

ON CONFLICT ("numero_stand") DO UPDATE
SET "estado"     = EXCLUDED."estado",
    "coordenada" = EXCLUDED."coordenada",
    "sectorId"   = EXCLUDED."sectorId",
    "updatedAt"  = NOW();

-- ============================================================
-- 7. USUARIOS INICIALES (Para probar login y permisos)
-- Hashes generados con bcrypt (10 rounds):
-- Password de Admin:       'AdminPoncho2026!'
-- Password de Organizador: 'Organizador2026!'
-- Password de Artesanos:   'Artesano2026!'
-- Password de Usuario:     'Password123.'
-- ============================================================
INSERT INTO "Usuario" ("id_usuario", "nombre", "apellido", "dni", "email", "telefono", "passwordHash", "rolId", "localidadId", "updatedAt") VALUES
-- Admin (rolId: 1)
('a0000000-0000-4000-8000-000000000001'::uuid, 
 'Administrador', 'Poncho', '11111111', 'admin@ponchodigital.com', '3834111111', 
 '$2b$10$efWDIKJqRwZUYTUhRjKD/uPeE3EoHD02gzQx6ABCjmGvV6IwgyNOK', 1, 1, NOW()),

-- Organizador (rolId: 2)
('a0000000-0000-4000-8000-000000000002'::uuid, 
 'Organizador', 'Feria', '22222222', 'organizador@ponchodigital.com', '3834222222', 
 '$2b$10$DYk98Ep0hbuI84JGTiUthexJQqjwf4RUf.Lw88ZLCY.jEU1fma0Tm', 2, 1, NOW()),

-- Usuario estándar / Visitante (rolId: 3)
('a0000000-0000-4000-8000-000000000003'::uuid, 
 'Usuario', 'Prueba', '33333333', 'usuario.test@gmail.com', '3834333333', 
 '$2b$10$MH5.p5piJc/uvyfTEn3wh.c.Vsv1kF/ADEIKIXj5QvRyWpOKllvJS', 3, 1, NOW()),

-- Artesanos iniciales habilitados (rolId: 3, password: 'Artesano2026!')
('a0000000-0000-4000-8000-000000000004'::uuid, 
 'Rosa', 'Quinteros', '28444555', 'rosa.quinteros@ponchodigital.com', '3834444555', 
 '$2b$10$uE6sbrEWLaYs8gLWrJNuTOoIlcv9Wi8Ffx0ndFdr/hFrSOPLmFvYy', 3, 4, NOW()),

('a0000000-0000-4000-8000-000000000005'::uuid, 
 'Carlos', 'Mamaní', '29666777', 'carlos.mamani@ponchodigital.com', '3834666777', 
 '$2b$10$uE6sbrEWLaYs8gLWrJNuTOoIlcv9Wi8Ffx0ndFdr/hFrSOPLmFvYy', 3, 6, NOW()),

('a0000000-0000-4000-8000-000000000006'::uuid, 
 'Elena', 'Vega', '31888999', 'elena.vega@ponchodigital.com', '3834888999', 
 '$2b$10$uE6sbrEWLaYs8gLWrJNuTOoIlcv9Wi8Ffx0ndFdr/hFrSOPLmFvYy', 3, 7, NOW())

ON CONFLICT ("email") DO UPDATE 
SET "id_usuario"   = EXCLUDED."id_usuario",
    "passwordHash" = EXCLUDED."passwordHash",
    "rolId"        = EXCLUDED."rolId",
    "activo"       = true,
    "updatedAt"    = NOW();

-- ============================================================
-- 8. SOLICITUDES APROBADAS DE LOS ARTESANOS INICIALES
-- ============================================================
INSERT INTO "Solicitud" ("estado_solicitud", "observaciones_admin", "nombre_emprendimiento", "descripcion_emprendimiento", "usuarioId", "rubroId", "updatedAt") VALUES
('APROBADO'::"EstadoSolicitud", 'Artesana textil de Belén verificada.', 'Hilados de Belén', 'Tejidos tradicionales en fibra de llama, oveja y vicuña en telar criollo', 'a0000000-0000-4000-8000-000000000004'::uuid, (SELECT "id_rubro" FROM "Rubro" WHERE "nombre_rubro" = 'Textil' LIMIT 1), NOW()),
('APROBADO'::"EstadoSolicitud", 'Taller de cerámica de Santa María aprobado.', 'Alfarería Yokavil', 'Vasijas, cuencos y esculturas en arcilla roja horneada a leña', 'a0000000-0000-4000-8000-000000000005'::uuid, (SELECT "id_rubro" FROM "Rubro" WHERE "nombre_rubro" = 'Cerámica' LIMIT 1), NOW()),
('APROBADO'::"EstadoSolicitud", 'Orfebrería en rodocrosita de Andalgalá aprobada.', 'Joyas del Aconquija', 'Orfebrería en plata y piedra nacional rodocrosita (Rosa del Inca)', 'a0000000-0000-4000-8000-000000000006'::uuid, (SELECT "id_rubro" FROM "Rubro" WHERE "nombre_rubro" = 'Metal y Orfebrería' LIMIT 1), NOW())
ON CONFLICT ("usuarioId") DO UPDATE
SET "estado_solicitud"           = EXCLUDED."estado_solicitud",
    "nombre_emprendimiento"      = EXCLUDED."nombre_emprendimiento",
    "descripcion_emprendimiento" = EXCLUDED."descripcion_emprendimiento",
    "rubroId"                    = EXCLUDED."rubroId",
    "updatedAt"                  = NOW();

-- ============================================================
-- 9. PERFILES DE ARTESANOS ACTIVOS
-- ============================================================
INSERT INTO "Artesano" ("nombre_emprendimiento", "descripcion_emprendimiento", "estado", "usuarioId", "rubroId", "updatedAt") VALUES
('Hilados de Belén', 'Tejidos tradicionales en fibra de llama, oveja y vicuña en telar criollo', 'ACTIVO'::"EstadoArtesano", 'a0000000-0000-4000-8000-000000000004'::uuid, (SELECT "id_rubro" FROM "Rubro" WHERE "nombre_rubro" = 'Textil' LIMIT 1), NOW()),
('Alfarería Yokavil', 'Vasijas, cuencos y esculturas en arcilla roja horneada a leña', 'ACTIVO'::"EstadoArtesano", 'a0000000-0000-4000-8000-000000000005'::uuid, (SELECT "id_rubro" FROM "Rubro" WHERE "nombre_rubro" = 'Cerámica' LIMIT 1), NOW()),
('Joyas del Aconquija', 'Orfebrería en plata y piedra nacional rodocrosita (Rosa del Inca)', 'ACTIVO'::"EstadoArtesano", 'a0000000-0000-4000-8000-000000000006'::uuid, (SELECT "id_rubro" FROM "Rubro" WHERE "nombre_rubro" = 'Metal y Orfebrería' LIMIT 1), NOW())
ON CONFLICT ("usuarioId") DO UPDATE
SET "estado"                     = 'ACTIVO'::"EstadoArtesano",
    "nombre_emprendimiento"      = EXCLUDED."nombre_emprendimiento",
    "descripcion_emprendimiento" = EXCLUDED."descripcion_emprendimiento",
    "rubroId"                    = EXCLUDED."rubroId",
    "updatedAt"                  = NOW();

-- ============================================================
-- 10. PRODUCTOS DEL CATÁLOGO INICIAL (10 Productos para paginación y filtros)
-- ============================================================
DELETE FROM "Producto" WHERE "artesanoId" IN (
  SELECT "id_artesano" FROM "Artesano" WHERE "usuarioId" IN (
    'a0000000-0000-4000-8000-000000000004'::uuid,
    'a0000000-0000-4000-8000-000000000005'::uuid,
    'a0000000-0000-4000-8000-000000000006'::uuid
  )
);

INSERT INTO "Producto" ("nombre_producto", "precio", "artesanoId", "updatedAt") VALUES
-- Productos de Rosa Quinteros (Hilados de Belén - Textil)
('Poncho Catamarqueño Tradicional', 165000, (SELECT "id_artesano" FROM "Artesano" WHERE "usuarioId" = 'a0000000-0000-4000-8000-000000000004'::uuid), NOW()),
('Ruana de Fibra de Llama',          85000, (SELECT "id_artesano" FROM "Artesano" WHERE "usuarioId" = 'a0000000-0000-4000-8000-000000000004'::uuid), NOW()),
('Chalina de Vicuña Belicha',       220000, (SELECT "id_artesano" FROM "Artesano" WHERE "usuarioId" = 'a0000000-0000-4000-8000-000000000004'::uuid), NOW()),
('Manta Rústica de Telar Criollo',   68000, (SELECT "id_artesano" FROM "Artesano" WHERE "usuarioId" = 'a0000000-0000-4000-8000-000000000004'::uuid), NOW()),

-- Productos de Carlos Mamaní (Alfarería Yokavil - Cerámica)
('Vasija Ceremonial Santamariana',   42000, (SELECT "id_artesano" FROM "Artesano" WHERE "usuarioId" = 'a0000000-0000-4000-8000-000000000005'::uuid), NOW()),
('Juego de Cuencos de Greda',        25000, (SELECT "id_artesano" FROM "Artesano" WHERE "usuarioId" = 'a0000000-0000-4000-8000-000000000005'::uuid), NOW()),
('Tinaja de Barro Cocido a Leña',    54000, (SELECT "id_artesano" FROM "Artesano" WHERE "usuarioId" = 'a0000000-0000-4000-8000-000000000005'::uuid), NOW()),

-- Productos de Elena Vega (Joyas del Aconquija - Metal y Orfebrería)
('Anillo de Plata y Rodocrosita',    38000, (SELECT "id_artesano" FROM "Artesano" WHERE "usuarioId" = 'a0000000-0000-4000-8000-000000000006'::uuid), NOW()),
('Dije Rosa del Inca Engarzado',     45000, (SELECT "id_artesano" FROM "Artesano" WHERE "usuarioId" = 'a0000000-0000-4000-8000-000000000006'::uuid), NOW()),
('Cuchillo Criollo con Cabo de Alpaca', 92000, (SELECT "id_artesano" FROM "Artesano" WHERE "usuarioId" = 'a0000000-0000-4000-8000-000000000006'::uuid), NOW());
