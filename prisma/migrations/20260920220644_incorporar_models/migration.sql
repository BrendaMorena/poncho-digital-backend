/*
  Warnings:

  - The primary key for the `Stand` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Stand` table. All the data in the column will be lost.
  - You are about to drop the column `pabellon` on the `Stand` table. All the data in the column will be lost.
  - You are about to drop the column `sector` on the `Stand` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[numero_stand]` on the table `Stand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[artesanoId]` on the table `Stand` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `numero_stand` to the `Stand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pabellonId` to the `Stand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sectorId` to the `Stand` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('APROBADO', 'RECHAZADO', 'PENDIENTE', 'MODIFICACION_SOLICITADA');

-- DropIndex
DROP INDEX "Stand_sector_key";

-- AlterTable
ALTER TABLE "Stand" DROP CONSTRAINT "Stand_pkey",
DROP COLUMN "id",
DROP COLUMN "pabellon",
DROP COLUMN "sector",
ADD COLUMN     "artesanoId" INTEGER,
ADD COLUMN     "id_stand" SERIAL NOT NULL,
ADD COLUMN     "numero_stand" TEXT NOT NULL,
ADD COLUMN     "pabellonId" INTEGER NOT NULL,
ADD COLUMN     "sectorId" INTEGER NOT NULL,
ADD CONSTRAINT "Stand_pkey" PRIMARY KEY ("id_stand");

-- CreateTable
CREATE TABLE "Artesano" (
    "id_artesano" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "id_solicitudP" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "rubroId" INTEGER NOT NULL,

    CONSTRAINT "Artesano_pkey" PRIMARY KEY ("id_artesano")
);

-- CreateTable
CREATE TABLE "Busqueda" (
    "id_busqueda" SERIAL NOT NULL,
    "termino_busqueda" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "usuarioId" INTEGER,
    "rubroId" INTEGER,
    "localidadId" INTEGER,
    "pabellonId" INTEGER,

    CONSTRAINT "Busqueda_pkey" PRIMARY KEY ("id_busqueda")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id_producto" SERIAL NOT NULL,
    "nombre_producto" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "artesanoId" INTEGER NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id_producto")
);

-- CreateTable
CREATE TABLE "Rol" (
    "id_rol" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rolId" INTEGER NOT NULL,
    "localidadId" INTEGER NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Rubro" (
    "id_rubro" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rubro_pkey" PRIMARY KEY ("id_rubro")
);

-- CreateTable
CREATE TABLE "Solicitud" (
    "id_solicitud" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado_solicitud" "EstadoSolicitud" NOT NULL DEFAULT 'PENDIENTE',
    "observaciones_admin" TEXT,
    "descripcion_emprendimiento" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("id_solicitud")
);

-- CreateTable
CREATE TABLE "Localidad" (
    "id_localidad" SERIAL NOT NULL,
    "nombre_locacion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Localidad_pkey" PRIMARY KEY ("id_localidad")
);

-- CreateTable
CREATE TABLE "Pabellon" (
    "id_pabellon" SERIAL NOT NULL,
    "nombre_pabellon" TEXT NOT NULL,
    "descripcion_pabellon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pabellon_pkey" PRIMARY KEY ("id_pabellon")
);

-- CreateTable
CREATE TABLE "Sector" (
    "id_sector" SERIAL NOT NULL,
    "codigo_sector" TEXT NOT NULL,
    "nombre_sector" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sector_pkey" PRIMARY KEY ("id_sector")
);

-- CreateIndex
CREATE UNIQUE INDEX "Artesano_usuarioId_key" ON "Artesano"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Rubro_nombre_key" ON "Rubro"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Solicitud_usuarioId_key" ON "Solicitud"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Localidad_nombre_locacion_key" ON "Localidad"("nombre_locacion");

-- CreateIndex
CREATE UNIQUE INDEX "Pabellon_nombre_pabellon_key" ON "Pabellon"("nombre_pabellon");

-- CreateIndex
CREATE UNIQUE INDEX "Sector_codigo_sector_key" ON "Sector"("codigo_sector");

-- CreateIndex
CREATE UNIQUE INDEX "Sector_nombre_sector_key" ON "Sector"("nombre_sector");

-- CreateIndex
CREATE UNIQUE INDEX "Stand_numero_stand_key" ON "Stand"("numero_stand");

-- CreateIndex
CREATE UNIQUE INDEX "Stand_artesanoId_key" ON "Stand"("artesanoId");

-- AddForeignKey
ALTER TABLE "Stand" ADD CONSTRAINT "Stand_artesanoId_fkey" FOREIGN KEY ("artesanoId") REFERENCES "Artesano"("id_artesano") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stand" ADD CONSTRAINT "Stand_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id_sector") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stand" ADD CONSTRAINT "Stand_pabellonId_fkey" FOREIGN KEY ("pabellonId") REFERENCES "Pabellon"("id_pabellon") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artesano" ADD CONSTRAINT "Artesano_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artesano" ADD CONSTRAINT "Artesano_rubroId_fkey" FOREIGN KEY ("rubroId") REFERENCES "Rubro"("id_rubro") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Busqueda" ADD CONSTRAINT "Busqueda_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Busqueda" ADD CONSTRAINT "Busqueda_rubroId_fkey" FOREIGN KEY ("rubroId") REFERENCES "Rubro"("id_rubro") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Busqueda" ADD CONSTRAINT "Busqueda_localidadId_fkey" FOREIGN KEY ("localidadId") REFERENCES "Localidad"("id_localidad") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Busqueda" ADD CONSTRAINT "Busqueda_pabellonId_fkey" FOREIGN KEY ("pabellonId") REFERENCES "Pabellon"("id_pabellon") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_artesanoId_fkey" FOREIGN KEY ("artesanoId") REFERENCES "Artesano"("id_artesano") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_localidadId_fkey" FOREIGN KEY ("localidadId") REFERENCES "Localidad"("id_localidad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
