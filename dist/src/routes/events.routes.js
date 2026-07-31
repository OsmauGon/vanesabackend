import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createEvento, deleteEvento, getEventoById, getPrivateEventos, getPublicEventos, updateEvento } from "../controllers/events.controllers.js";
export const router = Router();
// Endpoints públicos (ej. listado de eventos)
router.get("/", getPublicEventos);
router.get("/private/:id", getEventoById);
// Endpoints protegidos (solo admin)
router.get("/private/", authMiddleware, getPrivateEventos);
router.post("/private/", authMiddleware, createEvento);
router.put("/private/:id", authMiddleware, updateEvento);
router.delete("/private/:id", authMiddleware, deleteEvento);
//# sourceMappingURL=events.routes.js.map