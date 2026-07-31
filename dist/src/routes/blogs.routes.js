// src/routes/veterinaria.routes.ts
// El archivo veterinaria.routes.ts es el que define los endpoints de Express para el recurso Veterinarias. Su función es conectar las rutas HTTP con los controladores que contienen la lógica de negocio.
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createblog, deleteblog, getblogById, getPrivateBlogs, getPublicBlogs, updateblog } from "../controllers/blogs.controllers.js";
export const router = Router();
// Endpoints públicos (ej. listado de veterinarias)
router.get("/", getPublicBlogs);
router.get("/private/:id", getblogById);
// Endpoints protegidos (solo admin)
router.get("/private/", authMiddleware, getPrivateBlogs);
router.post("/private/", authMiddleware, createblog);
router.put("/private/:id", authMiddleware, updateblog);
router.delete("/private/:id", authMiddleware, deleteblog);
//# sourceMappingURL=blogs.routes.js.map