/*
  Warnings:

  - You are about to drop the `Mascota` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Veterinaria` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `finDeSuscripcion` to the `Servicio` table without a default value. This is not possible if the table is not empty.
  - Made the column `telefono` on table `Servicio` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Mascota" DROP CONSTRAINT "Mascota_duenioId_fkey";

-- AlterTable
ALTER TABLE "Blog" ALTER COLUMN "idOwner" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "contacto" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MissingPost" ALTER COLUMN "contact" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Servicio" ADD COLUMN     "finDeSuscripcion" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "descripcion" DROP NOT NULL,
ALTER COLUMN "contacto" DROP NOT NULL,
ALTER COLUMN "telefono" SET NOT NULL;

-- DropTable
DROP TABLE "Mascota";

-- DropTable
DROP TABLE "Usuario";

-- DropTable
DROP TABLE "Veterinaria";
