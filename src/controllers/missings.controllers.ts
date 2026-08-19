import { Request, Response } from "express";
import { prisma } from '../utils/prisma.js' // instancia de Prisma
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";



// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Middleware de multer para manejar archivos
const upload = multer({ dest: "uploads/" });
// Obtener todas las missingPosts
export const getmissingPosts = async (req: Request, res: Response) => {
  try {
    const missingPosts = await prisma.missingPost.findMany();
     res.status(200).json({message: "todo bien", data: missingPosts});
  } catch (error) {
    res.status(500).json({ error: "Error al obtener missingPosts" });
  }
};

// Obtener una missingPost por ID
export const getmissingPostById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const missingPost = await prisma.missingPost.findUnique({
      where: { id: Number(id) },
    });
    if (!missingPost) return res.status(404).json({ error: "No encontrada" });
    res.json(missingPost);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener missingPost" });
  }
};

// Crear una nueva missingPost
export const createmissingPost = [
  upload.single("imagen"), // 👈 nombre del campo en el formData
  async (req: Request, res: Response) => {
    const { title, 
      description, 
      contact, 
      tipo, 
      
     } = req.body;
    const file = req.file;

    if (!title || !description || !contact || !tipo || !file) {
      return res.status(400).json({
        error: "Faltan credenciales obligatorias o imagen",
        data: {
          title, description, contact, tipo
        }
      });
    }

    try {
      // 📤 Subir imagen a Cloudinary
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "profesionales",
      });

      // 🗄️ Guardar registro en DB
      const nueva = await prisma.missingPost.create({
        data: {
          title,
          description,
          imageUrl: uploadResult.secure_url,
          contact,
          tipo
        },
      });

      res.status(201).json({message: "EXITO", data: nueva});
    } catch (error: any) {
      console.error("Error al crear posteo:", error);
      res.status(500).json({
        error: "Error interno al crear profesional",
        details: error.message,
      });
    }
  },
];

// Actualizar una missingPost
export const updatemissingPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, contact, tipo } = req.body;
  try {
    const actualizado = await prisma.missingPost.update({
      where: { id: Number(id) },
      data: { title, description, contact, tipo },
    });
    res.json({message:"PUT EXITOSO", data: actualizado});
  } catch (error) {
    console.log(error)
    res.status(500).json("Error al actualizar el recurso")
  }
};

// Eliminar una missingPost
export const deletemissingPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.missingPost.delete({ where: { id: Number(id) } });
    res.json({ message: "missingPost eliminada" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar missingPost" });
  }
};
