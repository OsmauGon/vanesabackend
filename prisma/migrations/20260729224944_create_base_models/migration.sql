-- CreateEnum
CREATE TYPE "MissingPostType" AS ENUM ('EXTRAVIADO', 'ENCONTRADO', 'ADOPCION');

-- CreateEnum
CREATE TYPE "BlogState" AS ENUM ('ABLE', 'DISABLE', 'STANDBY');

-- CreateEnum
CREATE TYPE "AdvertisementState" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "Professional" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "horario" TEXT,
    "servicios" TEXT[],
    "telefono" TEXT,
    "email" TEXT,
    "redSocial" TEXT,
    "finDeSuscripcion" TIMESTAMP(3) NOT NULL,
    "insignias" TEXT[],
    "ubicacion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Professional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Establishment" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    "servicios" TEXT[],
    "telefono" TEXT[],
    "email" TEXT,
    "redSocial" TEXT,
    "finDeSuscripcion" TIMESTAMP(3) NOT NULL,
    "insignias" TEXT[],
    "profesionalesVinculados" TEXT[],
    "ubicacion" TEXT,
    "latitud" DOUBLE PRECISION,
    "longitud" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Establishment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MissingPost" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "location" TEXT,
    "contact" TEXT NOT NULL,
    "tipo" "MissingPostType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MissingPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "fecha" TEXT NOT NULL,
    "hora" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "responsable" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "contacto" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" SERIAL NOT NULL,
    "idOwner" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "documentUrl" TEXT,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "state" "BlogState" NOT NULL DEFAULT 'STANDBY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publicidad" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "finDeSuscripcion" TIMESTAMP(3) NOT NULL,
    "imageUrlGrande" TEXT,
    "imageUrlChico" TEXT,
    "contacto" TEXT NOT NULL,
    "state" "AdvertisementState" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Publicidad_pkey" PRIMARY KEY ("id")
);
