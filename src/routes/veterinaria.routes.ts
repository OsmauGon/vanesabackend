// src/routes/veterinaria.routes.ts
// El archivo veterinaria.routes.ts es el que define los endpoints de Express para el recurso Veterinarias. Su función es conectar las rutas HTTP con los controladores que contienen la lógica de negocio.
import { Router } from "express";
import { 
  getVeterinariaById, 
  createVeterinaria, 
  updateVeterinaria, 
  deleteVeterinaria, 
  getPrivateVeterinarias,
  getPublicVeterinarias,
  patchEstablecimientoSuscripcion,
  patchEstablecimientoImagen
} from "../controllers/veterinaria.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";


export const router = Router();

// Endpoints públicos (ej. listado de veterinarias)
router.get("/", getPublicVeterinarias);
router.get("/private/:id", getVeterinariaById);

// Endpoints protegidos (solo admin)
router.get("/private/", authMiddleware, getPrivateVeterinarias);
router.post("/private/", authMiddleware, createVeterinaria);
router.put("/private/:id", authMiddleware, updateVeterinaria);
router.patch("/private/:id",authMiddleware,patchEstablecimientoSuscripcion);
router.patch("/image/:id",authMiddleware,patchEstablecimientoImagen);

router.delete("/private/:id", authMiddleware, deleteVeterinaria);
