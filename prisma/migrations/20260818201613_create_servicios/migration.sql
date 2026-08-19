-- CreateEnum
CREATE TYPE "ServiceClass" AS ENUM ('SERVICIO', 'PRODUCTO');

-- CreateTable
CREATE TABLE "Servicio" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "topico" TEXT NOT NULL,
    "imagenLogo" TEXT NOT NULL,
    "contacto" TEXT NOT NULL,
    "telefono" TEXT,
    "redSocial" TEXT,
    "clase" "ServiceClass" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Servicio_pkey" PRIMARY KEY ("id")
);
