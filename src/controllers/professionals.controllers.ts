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

// Obtener todas las professionals

export const getPublicProfessionals = async (req: Request, res: Response) => {
  try {
    const professionals = await prisma.professional.findMany({
      where: {
        finDeSuscripcion: {
          gte: new Date(),
        },
      },
      select: {
        id: true,
        nombre: true,
        imagen: true,
        horario: true,
        servicios: true,
        redSocial: true,
        insignias: true,
        ubicacion: true,
        telefono: true,
        email: true,
      },
    });
  //gte es expresion q normalmente si querrías mostrar solo los profesionales con suscripción activa, eso se expresa con el operador gte (greater than or equal):
    res.status(200).json({message: "todo bien", data: professionals});
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al obtener professionals" });
  }
};
export const getPrivateProfessionals = async (req: Request, res: Response) => {
  try {
    const professionals = await prisma.professional.findMany();
    //aqui seria conveniente mantener select
     res.status(200).json({message: "todo bien", data: professionals});
  } catch (error) {
    res.status(500).json({ error: "Error al obtener professionals" });
  }
};
// Obtener una professional por ID
export const getprofessionalById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const professional = await prisma.professional.findUnique({
      where: { id: Number(id) },
    });
    if (!professional) return res.status(404).json({ error: "No encontrada" });
    res.json(professional);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener professional" });
  }
};

// Crear una nueva professional
export const createProfessional = [
  upload.single("imagen"), // 👈 nombre del campo en el formData
  async (req: Request, res: Response) => {
    const { nombre, 
      servicios, 
      horario, 
      finDeSuscripcion, 
      telefono, 
      email, 
      redSocial,
      insignias,
      ubicacion,
     } = req.body;
    const file = req.file;

    if (!nombre || !servicios || !horario || !finDeSuscripcion || !file) {
      return res.status(400).json({
        error: "Faltan credenciales obligatorias o imagen",
      });
    }

    try {
      // 📤 Subir imagen a Cloudinary
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "profesionales",
      });

      // 🗄️ Guardar registro en DB
      const nueva = await prisma.professional.create({
        data: {
          nombre,
          servicios: JSON.parse(servicios),
          horario,
          imagen: uploadResult.secure_url,
          finDeSuscripcion: new Date(finDeSuscripcion),
          telefono: JSON.parse(telefono),
          insignias: JSON.parse(insignias),
          email,
          redSocial
        },
      });

      res.status(201).json(nueva);
    } catch (error: any) {
      console.error("Error al crear profesional:", error);
      res.status(500).json({
        error: "Error interno al crear profesional",
        details: error.message,
      });
    }
  },
];

// Actualizar una professional
export const updateprofessional = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, direccion, telefono, email } = req.body;
  try {
    const actualizada = await prisma.professional.update({
      where: { id: Number(id) },
      data: { nombre, direccion, telefono, email },
    });
    res.json(actualizada);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar professional" });
  }
};

// Eliminar una professional
export const deleteprofessional = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.professional.delete({ where: { id: Number(id) } });
    res.json({ message: "professional eliminada" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar professional" });
  }
};
