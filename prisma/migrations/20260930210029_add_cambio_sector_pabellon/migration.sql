/*
  Warnings:

  - You are about to drop the column `pabellonId` on the `Stand` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Stand" DROP CONSTRAINT "Stand_pabellonId_fkey";

-- AlterTable
ALTER TABLE "Sector" ADD COLUMN     "pabellonId" INTEGER;

-- AlterTable
ALTER TABLE "Stand" DROP COLUMN "pabellonId";

-- AddForeignKey
ALTER TABLE "Sector" ADD CONSTRAINT "Sector_pabellonId_fkey" FOREIGN KEY ("pabellonId") REFERENCES "Pabellon"("id_pabellon") ON DELETE RESTRICT ON UPDATE CASCADE;
