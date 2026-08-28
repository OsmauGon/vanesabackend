import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createServicio, deleteServicio, getPrivateServicios, getPublicServicios, getservicioById, patchServicioSuscripcion, updateServicio } from "../controllers/servicio.controller.js";
export const router = Router();
router.get("/", getPublicServicios);
router.get("/private/:id", getservicioById);
router.get("/private/", authMiddleware, getPrivateServicios);
router.post("/private/", createServicio);
router.put("/private/:id", authMiddleware, updateServicio);
router.patch("/private/:id", authMiddleware, patchServicioSuscripcion);
//router.patch("/image/:id",authMiddleware,patchServicioImage);
router.delete("/private/:id", authMiddleware, deleteServicio);
//# sourceMappingURL=servicio.route.js.map