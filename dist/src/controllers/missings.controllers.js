import { prisma } from '../utils/prisma.js'; // instancia de Prisma
// Obtener todas las missingPosts
export const getmissingPosts = async (req, res) => {
    try {
        const missingPosts = await prisma.missingPost.findMany();
        res.status(200).json({ message: "todo bien", data: missingPosts });
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener missingPosts" });
    }
};
// Obtener una missingPost por ID
export const getmissingPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const missingPost = await prisma.missingPost.findUnique({
            where: { id: Number(id) },
        });
        if (!missingPost)
            return res.status(404).json({ error: "No encontrada" });
        res.json(missingPost);
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener missingPost" });
    }
};
// Crear una nueva missingPost
export const createmissingPost = async (req, res) => {
    const { nombre, direccion, telefono, email } = req.body;
    /* try {
      const nueva = await prisma.missingPost.create({
        data: { nombre, direccion, telefono, email },
      });
      res.status(201).json(nueva);
    } catch (error) {
      res.status(500).json({ error: "Error al crear missingPost" });
    } */
};
// Actualizar una missingPost
export const updatemissingPost = async (req, res) => {
    const { id } = req.params;
    const { nombre, direccion, telefono, email } = req.body;
    try {
        const actualizada = await prisma.missingPost.update({
            where: { id: Number(id) },
            data: { nombre, direccion, telefono, email },
        });
        res.json(actualizada);
    }
    catch (error) {
        res.status(500).json({ error: "Error al actualizar missingPost" });
    }
};
// Eliminar una missingPost
export const deletemissingPost = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.missingPost.delete({ where: { id: Number(id) } });
        res.json({ message: "missingPost eliminada" });
    }
    catch (error) {
        res.status(500).json({ error: "Error al eliminar missingPost" });
    }
};
//# sourceMappingURL=missings.controllers.js.map