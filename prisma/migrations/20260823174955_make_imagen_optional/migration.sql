-- AlterTable
ALTER TABLE "Establishment" ADD COLUMN     "notas" TEXT[],
ALTER COLUMN "imagen" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Professional" ADD COLUMN     "notas" TEXT[],
ALTER COLUMN "imagen" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Servicio" ADD COLUMN     "notas" TEXT[],
ALTER COLUMN "imagenLogo" DROP NOT NULL;
