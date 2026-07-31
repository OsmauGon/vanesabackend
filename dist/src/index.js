/*
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import authRoutes from './routes/auth.js'

const app = express();

// Adaptador para Postgres
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
export const prisma = new PrismaClient({ adapter });

app.use(express.json());

// Middleware de verificación
app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});
app.use("/auth", authRoutes);

app.get('/', async (req, res) => {
  res.json({ message: 'Servidor funcionando 🚀' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
*/
import express from "express";
import { router as veterinariaRouter } from "./routes/veterinaria.routes.js";
const app = express();
app.use(express.json());
app.use("/api/vetes", veterinariaRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en src/index en puerto ${PORT}`);
});
//# sourceMappingURL=index.js.map