// src/routes/veterinaria.routes.ts
// El archivo veterinaria.routes.ts es el que define los endpoints de Express para el recurso Veterinarias. Su función es conectar las rutas HTTP con los controladores que contienen la lógica de negocio.
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createpublicidad, deletepublicidad, getPrivatePublicidads, getpublicidadById, getPublicPublicidads, updatepublicidad } from "../controllers/publicidad.controllers.js";
export const router = Router();
// Endpoints públicos (ej. listado de veterinarias)
router.get("/", getPublicPublicidads);
router.get("/private/:id", getpublicidadById);
// Endpoints protegidos (solo admin)
router.get("/private/", authMiddleware, getPrivatePublicidads);
router.post("/private/", authMiddleware, createpublicidad);
router.put("/private/:id", authMiddleware, updatepublicidad);
router.delete("/private/:id", authMiddleware, deletepublicidad);
//# sourceMappingURL=publicidad.routes.js.map