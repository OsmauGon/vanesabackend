import express from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import authRoutes from './src/routes/auth.js'
import "dotenv/config";


//import { router as veterinariaRouter } from './src/routes/veterinaria.routes.js'
import { router as professionalsRouter } from './src/routes/profesionals.routes.js'
import { router as establishmentsRouter} from './src/routes/veterinaria.routes.js'
import { router as missingpostsRouter} from './src/routes/missingposts.routes.js'
import { router as eventsRouter} from './src/routes/events.routes.js'
import { router as blogsRouter} from './src/routes/blogs.routes.js'
import { router as publicidadRouter} from './src/routes/publicidad.routes.js'

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
app.use("/api/vetes", establishmentsRouter);
app.use("/api/profes", professionalsRouter)
app.use("/api/events", eventsRouter);
app.use("/api/blogs", blogsRouter)
app.use("/api/missings", missingpostsRouter);
app.use("/api/publicidad", publicidadRouter)

app.get('/', async (req, res) => {
  res.json({ message: 'Servidor de index en raiz funcionando 🚀' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendoo en http://localhost:${PORT} en /index`);
});


