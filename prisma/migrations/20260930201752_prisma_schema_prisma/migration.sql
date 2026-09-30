/*
  Warnings:

  - Added the required column `rubroId` to the `Solicitud` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Solicitud" ADD COLUMN     "rubroId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_rubroId_fkey" FOREIGN KEY ("rubroId") REFERENCES "Rubro"("id_rubro") ON DELETE RESTRICT ON UPDATE CASCADE;
