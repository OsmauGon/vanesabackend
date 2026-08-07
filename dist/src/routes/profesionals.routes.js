// src/routes/veterinaria.routes.ts
// El archivo veterinaria.routes.ts es el que define los endpoints de Express para el recurso Veterinarias. Su función es conectar las rutas HTTP con los controladores que contienen la lógica de negocio.
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createProfessional, deleteprofessional, getPrivateProfessionals, getprofessionalById, getPublicProfessionals, updateprofessional } from "../controllers/professionals.controllers.js";
export const router = Router();
// Endpoints públicos (ej. listado de veterinarias)
router.get("/", getPublicProfessionals);
router.get("/private/:id", getprofessionalById);
// Endpoints protegidos (solo admin)
router.get("/private/", authMiddleware, getPrivateProfessionals);
router.post("/private/", createProfessional);
//router.post("/private/", authMiddleware, createProfessional);
router.put("/private/:id", authMiddleware, updateprofessional);
router.delete("/private/:id", authMiddleware, deleteprofessional);
//# sourceMappingURL=profesionals.routes.js.map