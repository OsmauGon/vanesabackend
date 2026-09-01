import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/auth.js';
import "dotenv/config";
//import { router as veterinariaRouter } from './src/routes/veterinaria.routes.js'
import { router as professionalsRouter } from './src/routes/profesionals.routes.js';
import { router as establishmentsRouter } from './src/routes/veterinaria.routes.js';
import { router as missingpostsRouter } from './src/routes/missingposts.routes.js';
import { router as eventsRouter } from './src/routes/events.routes.js';
import { router as blogsRouter } from './src/routes/blogs.routes.js';
import { router as publicidadRouter } from './src/routes/publicidad.routes.js';
import { router as serviceRouter } from './src/routes/servicio.route.js';
import { prisma } from './src/utils/prisma.js';
const app = express();
// Configuración básica: permite todas las solicitudes
app.use(cors());
/*
// Si quieres restringir a tu frontend en Vercel:
app.use(cors({
  origin: "https://tu-frontend.vercel.app", // dominio permitido
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // si usas cookies o headers de autenticación
}));
*/
/*
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "https://publico.midominio.com",   // frontend público
      "https://admin.vercel.app"         // frontend privado
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Origen no permitido por CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // se aplicará solo si el cliente envía cookies/headers
};

app.use(cors(corsOptions));
*/
app.use(express.json());
// Middleware de verificación
app.use((req, res, next) => {
    console.log(`Solicitud recibida: ${req.method} ${req.url}`);
    next();
});
app.use("/auth", authRoutes);
app.use("/api/vetes", establishmentsRouter);
app.use("/api/profes", professionalsRouter);
app.use("/api/events", eventsRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/missings", missingpostsRouter);
app.use("/api/publicidad", publicidadRouter);
app.use("/api/servis", serviceRouter);
app.get("/api/counts", async (req, res) => {
    try {
        const usuariosCount = await prisma.professional.count();
        const veterinariasCount = await prisma.establishment.count();
        const blogsCount = await prisma.blog.count();
        const eventCount = await prisma.event.count();
        const missingposts = await prisma.missingPost.count();
        const publicidad = await prisma.publicidad.count();
        const servicios = await prisma.servicio.count();
        res.json({
            profes: usuariosCount,
            vetes: veterinariasCount,
            blogs: blogsCount,
            events: eventCount,
            missingposts: missingposts,
            publicidades: publicidad,
            servis: servicios
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error obteniendo los conteos" });
    }
});
app.get('/', async (req, res) => {
    res.json({ message: 'Servidor de index en raiz funcionando 🚀' });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendoo en http://localhost:${PORT} en /index`);
});
//# sourceMappingURL=index.js.map