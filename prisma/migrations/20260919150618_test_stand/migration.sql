-- CreateEnum
CREATE TYPE "EstadoStand" AS ENUM ('DISPONIBLE', 'OCUPADO', 'MANTENIMIENTO');

-- CreateTable
CREATE TABLE "Stand" (
    "id" SERIAL NOT NULL,
    "sector" TEXT NOT NULL,
    "pabellon" TEXT NOT NULL,
    "estado" "EstadoStand" NOT NULL DEFAULT 'DISPONIBLE',
    "coordenada" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stand_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stand_sector_key" ON "Stand"("sector");
