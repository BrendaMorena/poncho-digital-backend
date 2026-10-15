/*
  Warnings:

  - You are about to drop the column `nombre` on the `Rubro` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nombre_rubro]` on the table `Rubro` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nombre_rubro` to the `Rubro` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Rubro_nombre_key";

-- AlterTable
ALTER TABLE "Rubro" RENAME COLUMN "nombre" TO "nombre_rubro";

-- CreateIndex
CREATE UNIQUE INDEX "Rubro_nombre_rubro_key" ON "Rubro"("nombre_rubro");
