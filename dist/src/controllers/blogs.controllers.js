import { prisma } from '../utils/prisma.js'; // instancia de Prisma
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
// Configuración de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Middleware de multer para manejar archivos
const upload = multer({ dest: "uploads/" });
// Obtener todas las blogs
export const getPublicBlogs = async (req, res) => {
    try {
        const blogs = await prisma.blog.findMany({
            select: {
                id: true,
                idOwner: true,
                title: true,
                description: true,
                bigdescription: true,
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
export const createblog = [
    upload.single("imagen"), // 👈 nombre del campo en el formData
    async (req, res) => {
        const { title, description, bigdescription, videoUrl, documentUrl, idOwner } = req.body;
        const file = req.file;
        if (!title || !description || !file) {
            return res.status(400).json({
                error: "Faltan credenciales obligatorias",
                data: {
                    title: title ? "Hay titulo" : "No hay titulo",
                    description: description ? "Hay descripcion" : "No hay descripcion",
                    file: file ? "Hay una imagen" : "No hay una imagen"
                }
            });
        }
        try {
            let uploadResult = null;
            // 📤 Subir imagen a Cloudinary solo si existe
            if (file) {
                uploadResult = await cloudinary.uploader.upload(file.path, {
                    folder: "veterinet-folder",
                });
            }
            ;
            // 🗄️ Guardar registro en DB
            const nueva = await prisma.blog.create({
                data: {
                    title,
                    idOwner: idOwner ? parseInt(idOwner) : null,
                    description,
                    bigdescription,
                    imageUrl: uploadResult ? uploadResult.secure_url : null, // 👈 null si no hay imagen
                    videoUrl,
                    documentUrl,
                },
            });
            res.status(201).json({ message: "EXITO", data: nueva });
        }
        catch (error) {
            console.error("Error al crear blog:", error);
            res.status(500).json({
                error: "Error interno al crear blog",
                details: error.message,
            });
        }
    },
];
// Actualizar una blog
export const updateblog = async (req, res) => {
    const { id } = req.params;
    const { title, description, bigdescription, documentUrl, videoUrl, state } = req.body;
    try {
        const actualizado = await prisma.blog.update({
            where: { id: Number(id) },
            data: { title, description, bigdescription, documentUrl, videoUrl, state },
        });
        res.json({ message: "PUT EXITOSO", data: actualizado });
    }
    catch (error) {
        console.log(error);
        res.status(500).json("Error al actualizar el recurso");
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
export const patchBlogImagen = [
    upload.single("imagen"), // 👈 campo en el formData
    async (req, res) => {
        /*
        Esta funcion debe guardar la nueva imagen en cloudinary, actualizar el registro en la base de datos y borrar la imagen antigua de cloudinary.
        El cliente envía un FormData con el campo imagen desde el front-end
        El servidor busca el registro actual y, si existe una imagen previa, la borra de Cloudinary usando su public_id.
        Sube la nueva imagen, guarda la URL pública y el public_id en la DB.
        Devuelve el registro actualizado.
        */
        const { id } = req.params;
        try {
            // Buscar el registro actual
            const oldBlog = await prisma.blog.findUnique({
                where: { id: Number(id) },
            });
            let data = { ...req.body };
            if (req.file) {
                // Si hay imagen nueva, borrar la anterior
                if (oldBlog?.imageUrl) {
                    await cloudinary.uploader.destroy(oldBlog.imageUrl);
                }
                // Subir ueva imagen
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: "veterinet-folder", // 👈 carpeta en Cloudinary
                });
                // Guardar URL y public_id
                data.imageUrl = result.secure_url;
                //data.imagenId = result.public_id;
            }
            const actualizado = await prisma.blog.update({
                where: { id: Number(id) },
                data,
            });
            res.json({ message: "PATCH EXITOSO", data: actualizado });
        }
        catch (error) {
            console.error(error);
            res.status(500).json("Error al actualizar el recurso");
        }
    },
];
//# sourceMappingURL=blogs.controllers.js.map