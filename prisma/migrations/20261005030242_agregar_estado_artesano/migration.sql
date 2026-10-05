-- CreateEnum
CREATE TYPE "EstadoArtesano" AS ENUM ('ACTIVO', 'INACTIVO', 'SUSPENDIDO');

-- AlterTable
ALTER TABLE "Artesano" ADD COLUMN     "estado" "EstadoArtesano" NOT NULL DEFAULT 'ACTIVO';
