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

// Obtener todas las publicidads
export const getPublicPublicidads = async (req: Request, res: Response) => {
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
    res.status(200).json({message: "todo bien", data: publicidads});
  } catch (error) {
    res.status(500).json({ error: "Error al obtener publicidads" });
  }
};
export const getPrivatePublicidads = async (req: Request, res: Response) => {
  try {
    const publicidads = await prisma.publicidad.findMany();
     res.status(200).json({message: "todo bien", data: publicidads});
  } catch (error) {
    res.status(500).json({ error: "Error al obtener publicidads" });
  }
};

// Obtener una publicidad por ID
export const getpublicidadById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const publicidad = await prisma.publicidad.findUnique({
      where: { id: Number(id) },
    });
    if (!publicidad) return res.status(404).json({ error: "No encontrada" });
    res.json(publicidad);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener publicidad" });
  }
};

// Crear una nueva publicidad
export const createpublicidad = [
  upload.single("imagen"), // 👈 nombre del campo en el formData
  async (req: Request, res: Response) => {
    const { titulo,
      contacto, 
      finDeSuscripcion, 
     } = req.body;
    const file = req.file;

    if (!titulo  || !contacto || !finDeSuscripcion || !file) {
      return res.status(400).json({
        error: "Faltan credenciales obligatorias o imagen",
        data: {
          titulo, contacto, finDeSuscripcion
        }
      });
    }

    try {
      // 📤 Subir imagen a Cloudinary
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "profesionales",
      });

      // 🗄️ Guardar registro en DB
      const nueva = await prisma.publicidad.create({
        data: {
          titulo,
          contacto,
          imageUrlChico: uploadResult.secure_url,
          finDeSuscripcion: new Date(finDeSuscripcion),
          
        },
      });

      res.status(201).json({message: "EXITO", data: nueva});
      //res.status(201).json({message: "Exito"});
    } catch (error: any) {
      console.error("Error al crear profesional:", error);
      res.status(500).json({
        error: "Error interno al crear profesional",
        details: error.message,
      });
    }
  },
];

// Actualizar una publicidad
export const updatepublicidad = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, direccion, telefono, email } = req.body;
  try {
    const actualizada = await prisma.publicidad.update({
      where: { id: Number(id) },
      data: { nombre, direccion, telefono, email },
    });
    res.json(actualizada);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar publicidad" });
  }
};

// Eliminar una publicidad
export const deletepublicidad = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.publicidad.delete({ where: { id: Number(id) } });
    res.json({ message: "publicidad eliminada" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar publicidad" });
  }
};
