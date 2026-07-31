// src/routes/veterinaria.routes.ts
// El archivo veterinaria.routes.ts es el que define los endpoints de Express para el recurso Veterinarias. Su función es conectar las rutas HTTP con los controladores que contienen la lógica de negocio.
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createmissingPost, deletemissingPost, getmissingPostById, getmissingPosts, updatemissingPost } from "../controllers/missings.controllers.js";
export const router = Router();
// Endpoints públicos (ej. listado de veterinarias)
router.get("/", getmissingPosts);
router.get("/private/:id", getmissingPostById);
// Endpoints protegidos (solo admin)
router.post("/private/", authMiddleware, createmissingPost);
router.put("/private/:id", authMiddleware, updatemissingPost);
router.delete("/private/:id", authMiddleware, deletemissingPost);
//# sourceMappingURL=missingposts.routes.js.map