//El archivo utils/prisma.ts es el encargado de inicializar y exportar el cliente de Prisma para que lo uses en tus controladores. Esto evita duplicar código y mantiene una sola instancia de conexión a la base de datos.// src/utils/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL no está definida en el entorno");
}
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });
//# sourceMappingURL=prisma.js.map