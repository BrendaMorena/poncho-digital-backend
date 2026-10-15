/*
  Warnings:

  - You are about to drop the column `descripcion` on the `Artesano` table. All the data in the column will be lost.
  - Added the required column `descripcion_emprendimiento` to the `Artesano` table without a default value. This is not possible if the table is not empty.

*/

-- AlterTable
ALTER TABLE "Artesano" RENAME COLUMN "descripcion" TO "descripcion_emprendimiento";
