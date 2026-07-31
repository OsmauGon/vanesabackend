import { prisma } from '../utils/prisma.js'; // instancia de Prisma
// Obtener todas las publicidads
export const getPublicPublicidads = async (req, res) => {
    try {
        const publicidads = await prisma.publicidad.findMany({
            where: {
                finDeSuscripcion: {
                    gte: new Date(),
                },
            },
            select: {
                id: true,
                titulo: true,
                imageUrlGrande: true,
                imageUrlChico: true,
                contacto: true,
            },
        });
        res.status(200).json({ message: "todo bien", data: publicidads });
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener publicidads" });
    }
};
export const getPrivatePublicidads = async (req, res) => {
    try {
        const publicidads = await prisma.publicidad.findMany();
        res.status(200).json({ message: "todo bien", data: publicidads });
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener publicidads" });
    }
};
// Obtener una publicidad por ID
export const getpublicidadById = async (req, res) => {
    const { id } = req.params;
    try {
        const publicidad = await prisma.publicidad.findUnique({
            where: { id: Number(id) },
        });
        if (!publicidad)
            return res.status(404).json({ error: "No encontrada" });
        res.json(publicidad);
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener publicidad" });
    }
};
// Crear una nueva publicidad
export const createpublicidad = async (req, res) => {
    const { nombre, direccion, telefono, email } = req.body;
    /* try {
      const nueva = await prisma.publicidad.create({
        data: { nombre, direccion, telefono, email },
      });
      res.status(201).json(nueva);
    } catch (error) {
      res.status(500).json({ error: "Error al crear publicidad" });
    } */
};
// Actualizar una publicidad
export const updatepublicidad = async (req, res) => {
    const { id } = req.params;
    const { nombre, direccion, telefono, email } = req.body;
    try {
        const actualizada = await prisma.publicidad.update({
            where: { id: Number(id) },
            data: { nombre, direccion, telefono, email },
        });
        res.json(actualizada);
    }
    catch (error) {
        res.status(500).json({ error: "Error al actualizar publicidad" });
    }
};
// Eliminar una publicidad
export const deletepublicidad = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.publicidad.delete({ where: { id: Number(id) } });
        res.json({ message: "publicidad eliminada" });
    }
    catch (error) {
        res.status(500).json({ error: "Error al eliminar publicidad" });
    }
};
//# sourceMappingURL=publicidad.controllers.js.map