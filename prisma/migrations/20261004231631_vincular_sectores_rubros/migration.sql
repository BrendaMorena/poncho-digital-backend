/*
  Warnings:

  - Made the column `sectorId` on table `Stand` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Sector" ADD COLUMN     "rubroId" INTEGER;

-- AlterTable
ALTER TABLE "Stand" ALTER COLUMN "sectorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Sector" ADD CONSTRAINT "Sector_rubroId_fkey" FOREIGN KEY ("rubroId") REFERENCES "Rubro"("id_rubro") ON DELETE SET NULL ON UPDATE CASCADE;
