-- ============================================================
-- SCRIPT COMPLETO DE SEMILLA / DATOS INICIALES (PONCHO DIGITAL)
-- ============================================================

-- ============================================================
-- 1. ROLES DEL SISTEMA (Requeridos por middlewares y servicios)
-- ============================================================
INSERT INTO "Rol" ("id_rol", "nombre", "descripcion", "updatedAt") VALUES
(1, 'ADMINISTRADOR', 'Acceso total y configuración del sistema', NOW()),
(2, 'ORGANIZADOR',   'Gestión de stands, artesanos y logística', NOW()),
(3, 'USUARIO',       'Visitante o postulante registrado', NOW())
ON CONFLICT ("nombre") DO NOTHING;

SELECT setval(pg_get_serial_sequence('"Rol"', 'id_rol'), coalesce(max("id_rol"), 1)) FROM "Rol";

-- ============================================================
-- 2. LOCALIDADES DE CATAMARCA (166 Localidades de ubicaciones.json)
-- ============================================================
INSERT INTO "Localidad" ("id_localidad", "nombre_locacion", "updatedAt") VALUES
(1, 'San Fernando del Valle de Catamarca', NOW()),
(2, 'El Desmonte', NOW()),
(3, 'Andalhuala', NOW()),
(4, 'El Pajonal', NOW()),
(5, 'Amadores', NOW()),
(6, 'El Aybal', NOW()),
(7, 'El Durazno', NOW()),
(8, 'Corral Quemado', NOW()),
(9, 'Belen', NOW()),
(10, 'El Potrero', NOW()),
(11, 'Aconquija', NOW()),
(12, 'Choya', NOW()),
(13, 'El Portezuelo', NOW()),
(14, 'Banda de Lucero', NOW()),
(15, 'Bañado de Ovanta', NOW()),
(16, 'Alijilan', NOW()),
(17, 'El Cajon', NOW()),
(18, 'El Divisadero', NOW()),
(19, 'El Alto', NOW()),
(20, 'Amanao', NOW()),
(21, 'El Rodeo', NOW()),
(22, 'El Pueblito', NOW()),
(23, 'Costa de Reyes', NOW()),
(24, 'Copacabana', NOW()),
(25, 'Colpes', NOW()),
(26, 'Apoyaco', NOW()),
(27, 'El Hueco', NOW()),
(28, 'Adolfo E. Carranza', NOW()),
(29, 'Antofalla', NOW()),
(30, 'El Lindero', NOW()),
(31, 'Ancasti', NOW()),
(32, 'El Bolson', NOW()),
(33, 'Chañar Punco', NOW()),
(34, 'Caspichango', NOW()),
(35, 'Colana', NOW()),
(36, 'El Pantanillo', NOW()),
(37, 'Coneta', NOW()),
(38, 'Concepcion', NOW()),
(39, 'El Alamito', NOW()),
(40, 'Chuchucaruana', NOW()),
(41, 'El Salado', NOW()),
(42, 'Cordobita', NOW()),
(43, 'Cerro Negro', NOW()),
(44, 'Antinaco', NOW()),
(45, 'Anillaco', NOW()),
(46, 'Casa de Piedra', NOW()),
(47, 'El Cerrito', NOW()),
(48, 'El Puesto', NOW()),
(49, 'El Rosario', NOW()),
(50, 'El Quimilo', NOW()),
(51, 'Collagasta', NOW()),
(52, 'El Bañado', NOW()),
(53, 'Colonia Nueva Coneta', NOW()),
(54, 'Colonia del Valle', NOW()),
(55, 'Chumbicha', NOW()),
(56, 'Capayan', NOW()),
(57, 'Balde de la Punta', NOW()),
(58, 'Condor Huasi', NOW()),
(59, 'Barranca Larga', NOW()),
(60, 'El Peñon', NOW()),
(61, 'Antofagasta de la Sierra', NOW()),
(62, 'Alto de las Juntas', NOW()),
(63, 'Buena Vista', NOW()),
(64, 'Chaquiago', NOW()),
(65, 'Andalgala', NOW()),
(66, 'Anquincila', NOW()),
(67, 'Huaycama', NOW()),
(68, 'Los Castillos', NOW()),
(69, 'Los Varela', NOW()),
(70, 'Farallon Negro', NOW()),
(71, 'Los Angeles Sur', NOW()),
(72, 'La Falda de San Antonio', NOW()),
(73, 'Villa las Pirquitas', NOW()),
(74, 'Esquiu', NOW()),
(75, 'La Guardia', NOW()),
(76, 'Las Esquinas', NOW()),
(77, 'La Bajada', NOW()),
(78, 'San Antonio', NOW()),
(79, 'Poman', NOW()),
(80, 'Fuerte Quemado', NOW()),
(81, 'Las Mojarras', NOW()),
(82, 'San Jose Villa', NOW()),
(83, 'Las Cañas', NOW()),
(84, 'Los Altos', NOW()),
(85, 'La Puntilla', NOW()),
(86, 'Fiambala', NOW()),
(87, 'La Ramadita', NOW()),
(88, 'Taton', NOW()),
(89, 'Las Tejas', NOW()),
(90, 'Las Juntas', NOW()),
(91, 'Los Talas', NOW()),
(92, 'La Candelaria', NOW()),
(93, 'La Majada', NOW()),
(94, 'La Aguada', NOW()),
(95, 'Miraflores', NOW()),
(96, 'San Pablo', NOW()),
(97, 'Guayamba', NOW()),
(98, 'Los Corrales', NOW()),
(99, 'Pomancillo Oeste', NOW()),
(100, 'San Jose', NOW()),
(101, 'La Dorada', NOW()),
(102, 'Las Palmitas', NOW()),
(103, 'Ramblones', NOW()),
(104, 'Las Lajas', NOW()),
(105, 'Lampacito', NOW()),
(106, 'La Hoyada', NOW()),
(107, 'Punta de Balasto', NOW()),
(108, 'San Pedro', NOW()),
(109, 'Palo Blanco', NOW()),
(110, 'Punta del Agua', NOW()),
(111, 'Pozo del Mistol', NOW()),
(112, 'San Isidro', NOW()),
(113, 'Villa Dolores', NOW()),
(114, 'Santa Cruz', NOW()),
(115, 'La Puerta', NOW()),
(116, 'Singuil', NOW()),
(117, 'La Mesada', NOW()),
(118, 'Los Nacimientos', NOW()),
(119, 'Los Angeles Norte', NOW()),
(120, 'Infanzon', NOW()),
(121, 'Vilisman', NOW()),
(122, 'Quiros', NOW()),
(123, 'Palo Labrado', NOW()),
(124, 'Joyango', NOW()),
(125, 'Loro Huasi', NOW()),
(126, 'San Jose Norte', NOW()),
(127, 'Santa Maria', NOW()),
(128, 'Manantiales', NOW()),
(129, 'Saujil', NOW()),
(130, 'Hualfin', NOW()),
(131, 'Jacipunco', NOW()),
(132, 'Londres', NOW()),
(133, 'Villa Vil', NOW()),
(134, 'Huillapima', NOW()),
(135, 'Pomancillo Este', NOW()),
(136, 'La Carrera', NOW()),
(137, 'Icaño', NOW()),
(138, 'Recreo', NOW()),
(139, 'La Viña', NOW()),
(140, 'Villa de Balcozna', NOW()),
(141, 'Mutquin', NOW()),
(142, 'Rincon', NOW()),
(143, 'San Miguel', NOW()),
(144, 'La Loma', NOW()),
(145, 'Yapes', NOW()),
(146, 'Los Balverdis', NOW()),
(147, 'Medanitos', NOW()),
(148, 'Tinogasta', NOW()),
(149, 'Polcos', NOW()),
(150, 'Sumalao', NOW()),
(151, 'Las Chacritas', NOW()),
(152, 'Puerta de Corral Quemado', NOW()),
(153, 'Puerta de San Jose', NOW()),
(154, 'San Martin', NOW()),
(155, 'Tapso', NOW()),
(156, 'La Tercena', NOW()),
(157, 'La Higuera', NOW()),
(158, 'La Merced', NOW()),
(159, 'Monte Potrero', NOW()),
(160, 'Sijan', NOW()),
(161, 'Famatanca', NOW()),
(162, 'San Jose Banda', NOW()),
(163, 'Palo Seco', NOW()),
(164, 'Lavalle', NOW()),
(165, 'Pampa Blanca', NOW()),
(166, 'Santa Rosa', NOW())
ON CONFLICT ("nombre_locacion") DO NOTHING;

SELECT setval(pg_get_serial_sequence('"Localidad"', 'id_localidad'), coalesce(max("id_localidad"), 1)) FROM "Localidad";

-- ============================================================
-- 3. RUBROS ARTESANALES Y TEMÁTICOS
-- ============================================================
INSERT INTO "Rubro" ("nombre", "updatedAt") VALUES
('Textil',               NOW()),
('Cerámica',             NOW()),
('Madera',               NOW()),
('Metal y Orfebrería',   NOW()),
('Cestería',             NOW()),
('Cuero',                NOW()),
('Manualidades',         NOW()),
('Productos Regionales', NOW()),
('Gastronomía',          NOW())
ON CONFLICT ("nombre") DO NOTHING;

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
    1, (SELECT "id_rubro" FROM "Rubro" WHERE "nombre" = 'Textil' LIMIT 1), NOW()),

('ART2',  'Sector Metales y Cerámica',     
    2, (SELECT "id_rubro" FROM "Rubro" WHERE "nombre" = 'Cerámica' LIMIT 1), NOW()),

('MAN',   'Sector Manualidades',           
    2, (SELECT "id_rubro" FROM "Rubro" WHERE "nombre" = 'Manualidades' LIMIT 1), NOW()),

('TUR',   'Sector Municipios de Catamarca', 
    3, NULL, NOW()),

('ALF',   'Sector Fábrica de Alfombras',   
    4, (SELECT "id_rubro" FROM "Rubro" WHERE "nombre" = 'Textil' LIMIT 1), NOW()),

('CULT',  'Sector Diseño y Editoriales',   
    5, (SELECT "id_rubro" FROM "Rubro" WHERE "nombre" = 'Manualidades' LIMIT 1), NOW()),

('REG',   'Sector Productos Regionales y Delicatessen', 
    NULL, (SELECT "id_rubro" FROM "Rubro" WHERE "nombre" = 'Productos Regionales' LIMIT 1), NOW()),

('VERDE', 'Sector Feria Verde y Viveros',               
    NULL, NULL, NOW()),

('FOOD',  'Zona Foodtrucks y Gastronomía',              
    NULL, (SELECT "id_rubro" FROM "Rubro" WHERE "nombre" = 'Gastronomía' LIMIT 1), NOW())

ON CONFLICT ("codigo_sector") DO UPDATE 
SET "rubroId"       = EXCLUDED."rubroId",
    "pabellonId"    = EXCLUDED."pabellonId",
    "nombre_sector" = EXCLUDED."nombre_sector",
    "updatedAt"     = NOW();

-- ============================================================
-- 6. STANDS (20 Stands del predio)
-- ============================================================
INSERT INTO "Stand" ("numero_stand", "estado", "coordenada", "sectorId", "updatedAt") VALUES
('1',  'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4682, "lng": -65.7791}'::json, 1, NOW()),
('2',  'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4684, "lng": -65.7793}'::json, 1, NOW()),
('3',  'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4686, "lng": -65.7795}'::json, 1, NOW()),
('4',  'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4690, "lng": -65.7800}'::json, 2, NOW()),
('5',  'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4691, "lng": -65.7801}'::json, 2, NOW()),
('6',  'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4692, "lng": -65.7802}'::json, 3, NOW()),
('7',  'MANTENIMIENTO'::"EstadoStand", '{"lat": -28.4694, "lng": -65.7804}'::json, 3, NOW()),
('8',  'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4701, "lng": -65.7808}'::json, 4, NOW()),
('9',  'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4703, "lng": -65.7810}'::json, 4, NOW()),
('10', 'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4689, "lng": -65.7785}'::json, 5, NOW()),
('11', 'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4690, "lng": -65.7787}'::json, 5, NOW()),
('12', 'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4708, "lng": -65.7798}'::json, 6, NOW()),
('13', 'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4710, "lng": -65.7800}'::json, 6, NOW()),
('14', 'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4678, "lng": -65.7812}'::json, 7, NOW()),
('15', 'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4680, "lng": -65.7814}'::json, 7, NOW()),
('16', 'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4665, "lng": -65.7820}'::json, 8, NOW()),
('17', 'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4667, "lng": -65.7822}'::json, 8, NOW()),
('18', 'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4715, "lng": -65.7825}'::json, 9, NOW()),
('19', 'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4718, "lng": -65.7828}'::json, 9, NOW()),
('20', 'DISPONIBLE'::"EstadoStand",    '{"lat": -28.4720, "lng": -65.7830}'::json, 9, NOW())

ON CONFLICT ("numero_stand") DO UPDATE
SET "estado"     = EXCLUDED."estado",
    "coordenada" = EXCLUDED."coordenada",
    "sectorId"   = EXCLUDED."sectorId",
    "updatedAt"  = NOW();

-- ============================================================
-- 7. USUARIOS INICIALES (Para probar login y permisos)
-- Hashes generados con bcrypt (10 rounds):
-- Password de Admin: 'AdminPoncho2026!'
-- Password de Usuario: 'Password123.'
-- ============================================================
INSERT INTO "Usuario" ("id_usuario", "nombre", "apellido", "dni", "email", "telefono", "passwordHash", "rolId", "localidadId", "updatedAt") VALUES
-- Admin (rolId: 1)
('a0000000-0000-0000-0000-000000000001'::uuid, 
 'Administrador', 'Poncho', '11111111', 'admin@ponchodigital.com', '3834111111', 
 '$2b$10$efWDIKJqRwZUYTUhRjKD/uPeE3EoHD02gzQx6ABCjmGvV6IwgyNOK', 1, 1, NOW()),

-- Usuario estándar / Visitante (rolId: 3)
('a0000000-0000-0000-0000-000000000003'::uuid, 
 'Usuario', 'Prueba', '33333333', 'usuario.test@gmail.com', '3834333333', 
 '$2b$10$MH5.p5piJc/uvyfTEn3wh.c.Vsv1kF/ADEIKIXj5QvRyWpOKllvJS', 3, 1, NOW())

ON CONFLICT ("email") DO NOTHING;
