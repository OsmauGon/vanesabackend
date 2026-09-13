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
      location, 
      
     } = req.body;
    const file = req.file;

    if (!tipo || !file) {
      return res.status(400).json({
        error: "Faltan credenciales obligatorias o imagen",
        data: {
          
          
         
          tipo: tipo  ? "Hay" : "No hay",
          file: file  ? "Hay" : "No hay"
        }
      });
    }

    try {
      // 📤 Subir imagen a Cloudinary
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "veterinet-folder",
      });

      // 🗄️ Guardar registro en DB
      const nueva = await prisma.missingPost.create({
        data: {
          title,
          description,
          imageUrl: uploadResult.secure_url,
          contact,
          tipo,
          location
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
  const { title, description, contact, tipo, location } = req.body;
  try {
    const actualizado = await prisma.missingPost.update({
      where: { id: Number(id) },
      data: { title, description, contact, tipo, location},
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
export const patchMissingImagen = [
  upload.single("imagen"), // 👈 campo en el formData
  async (req: Request, res: Response) => {
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
      const oldPost = await prisma.missingPost.findUnique({
        where: { id: Number(id) },
      });

      let data: any = { ...req.body };

      if (req.file) {
        // Si hay imagen nueva, borrar la anterior
        if (oldPost?.imageUrl) {
          await cloudinary.uploader.destroy(oldPost.imageUrl);
        }

        // Subir ueva imagen
        const result = await cloudinary.uploader.upload(req.file.path, {
           folder: "veterinet-folder",// 👈 carpeta en Cloudinary
        });

        // Guardar URL y public_id
        data.imageUrl = result.secure_url
        //data.imagenId = result.public_id;
      }

      const actualizado = await prisma.missingPost.update({
        where: { id: Number(id) },
        data,
      });

      res.json({ message: "PATCH EXITOSO", data: actualizado });
    } catch (error) {
      console.error(error);
      res.status(500).json("Error al actualizar el recurso");
    }
  },
];