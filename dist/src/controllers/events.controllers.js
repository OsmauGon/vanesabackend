import { prisma } from '../utils/prisma.js'; // instancia de Prisma
// Obtener todas las Eventos
export const getPublicEventos = async (req, res) => {
    try {
        const today = new Date();
        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        const events = await prisma.event.findMany({
            /*Lo borramos por ahora poruqe fecha es un string y gte necesita Date
            where: {
                fecha: {
                  gte: threeMonthsAgo,
                },
              },
              orderBy: {
                fecha: "asc",
              },
            });
            */
            orderBy: {
                fecha: "asc",
            },
        });
        res.status(200).json({ message: "todo bien", data: events });
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener Eventos" });
    }
};
export const getPrivateEventos = async (req, res) => {
    try {
        const eventos = await prisma.event.findMany();
        res.status(200).json({ message: "todo bien", data: eventos });
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener Eventos" });
    }
};
// Obtener una Evento por ID
export const getEventoById = async (req, res) => {
    const { id } = req.params;
    try {
        const Evento = await prisma.event.findUnique({
            where: { id: Number(id) },
        });
        if (!Evento)
            return res.status(404).json({ error: "No encontrada" });
        res.json(Evento);
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener Evento" });
    }
};
// Crear una nueva Evento
export const createEvento = async (req, res) => {
    const { nombre, direccion, telefono, email } = req.body;
    /* try {
      const nueva = await prisma.event.create({
        data: { nombre, direccion, telefono, email },
      });
      res.status(201).json(nueva);
    } catch (error) {
      res.status(500).json({ error: "Error al crear Evento" });
    } */
};
// Actualizar una Evento
export const updateEvento = async (req, res) => {
    const { id } = req.params;
    const { nombre, direccion, telefono, email } = req.body;
    try {
        const actualizada = await prisma.event.update({
            where: { id: Number(id) },
            data: { nombre, direccion, telefono, email },
        });
        res.json(actualizada);
    }
    catch (error) {
        res.status(500).json({ error: "Error al actualizar Evento" });
    }
};
// Eliminar una Evento
export const deleteEvento = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.event.delete({ where: { id: Number(id) } });
        res.json({ message: "Evento eliminada" });
    }
    catch (error) {
        res.status(500).json({ error: "Error al eliminar Evento" });
    }
};
//# sourceMappingURL=events.controllers.js.map