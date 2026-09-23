/*
  Warnings:

  - You are about to drop the column `id_solicitudP` on the `Artesano` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `Solicitud` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Artesano" DROP COLUMN "id_solicitudP";

-- AlterTable
ALTER TABLE "Solicitud" DROP COLUMN "descripcion";
