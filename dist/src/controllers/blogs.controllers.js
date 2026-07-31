import { prisma } from '../utils/prisma.js'; // instancia de Prisma
// Obtener todas las blogs
export const getPublicBlogs = async (req, res) => {
    try {
        const blogs = await prisma.blog.findMany({
            select: {
                id: true,
                idOwner: true,
                title: true,
                description: true,
                imageUrl: true,
                videoUrl: true,
                documentUrl: true,
                state: true
            }
        });
        res.status(200).json({ message: "todo bien", data: blogs });
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener blogs" });
    }
};
export const getPrivateBlogs = async (req, res) => {
    try {
        const blogs = await prisma.blog.findMany();
        res.status(200).json({ message: "todo bien", data: blogs });
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener blogs" });
    }
};
// Obtener una blog por ID
export const getblogById = async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await prisma.blog.findUnique({
            where: { id: Number(id) },
        });
        if (!blog)
            return res.status(404).json({ error: "No encontrada" });
        res.json(blog);
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener blog" });
    }
};
// Crear una nueva blog
export const createblog = async (req, res) => {
    const { nombre, direccion, telefono, email } = req.body;
    /* try {
      const nueva = await prisma.blog.create({
        data: { nombre, direccion, telefono, email },
      });
      res.status(201).json(nueva);
    } catch (error) {
      res.status(500).json({ error: "Error al crear blog" });
    } */
};
// Actualizar una blog
export const updateblog = async (req, res) => {
    const { id } = req.params;
    const { nombre, direccion, telefono, email } = req.body;
    try {
        const actualizada = await prisma.blog.update({
            where: { id: Number(id) },
            data: { nombre, direccion, telefono, email },
        });
        res.json(actualizada);
    }
    catch (error) {
        res.status(500).json({ error: "Error al actualizar blog" });
    }
};
// Eliminar una blog
export const deleteblog = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.blog.delete({ where: { id: Number(id) } });
        res.json({ message: "blog eliminada" });
    }
    catch (error) {
        res.status(500).json({ error: "Error al eliminar blog" });
    }
};
//# sourceMappingURL=blogs.controllers.js.map