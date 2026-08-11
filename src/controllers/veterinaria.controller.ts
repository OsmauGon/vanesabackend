//El archivo veterinaria.controller.ts es el que contiene la lógica de negocio para manejar las operaciones CRUD de las veterinarias. Aquí es donde Prisma interactúa con la base de datos y se devuelven las respuestas al cliente.
// src/controllers/veterinaria.controller.ts
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


// Obtener todas las veterinarias
export const getPrivateVeterinarias = async (req: Request, res: Response) => {
  try {
    const veterinarias = await prisma.establishment.findMany();
    res.json({message: "todo bien", data: veterinarias});
  } catch (error) {
    res.status(500).json({ error: "Error al obtener todas las veterinarias", data: error });
  }
};
export const getPublicVeterinarias = async (req: Request, res: Response) => {
  try {
    const veterinarias = await prisma.establishment.findMany({
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
  profesionalesVinculados: true,
  latitud: true,
  longitud: true

    
  },
    }); 
    /* const veterinarias = await prisma.veterinaria.findMany() */
    res.status(200).json({message: "todo bien", data: veterinarias});
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al obtener veterinarias publicas", data: error });
  }
};

// Obtener una veterinaria por ID
export const getVeterinariaById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const veterinaria = await prisma.veterinaria.findUnique({
      where: { id: Number(id) },
    });
    if (!veterinaria) return res.status(404).json({ error: "No encontrada" });
    res.json(veterinaria);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener veterinaria" });
  }
};

// Crear una nueva veterinaria
export const createVeterinaria = [
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
      profesionalesVinculados,
      ubicacion,
      latitud,
      longitud
     } = req.body;
    const file = req.file;

    if (!nombre || !servicios || !horario || !finDeSuscripcion || !file) {
      return res.status(400).json({
        error: "Faltan credenciales obligatorias o imagen",
        data: {
          nombre,
          servicios,
          horario,
          finDeSuscripcion
        }
      });
    }

    try {
      // 📤 Subir imagen a Cloudinary
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "veterinarias",
      });

      // 🗄️ Guardar registro en DB
      const nueva = await prisma.establishment.create({
        data: {
          ubicacion,
          nombre,
          servicios: JSON.parse(servicios),
          horario,
          imagen: uploadResult.secure_url,
          finDeSuscripcion: new Date(finDeSuscripcion),
          telefono: JSON.parse(telefono),
          insignias: JSON.parse(insignias),
          profesionalesVinculados: JSON.parse(profesionalesVinculados),
          email,
          redSocial,
          latitud : parseFloat(latitud),
          longitud: parseFloat(longitud)
        },
      });

      res.status(201).json({message: "EXITO", data: nueva});
    } catch (error: any) {
      console.error("Error al crear veterinaria:", error);
      res.status(500).json({
        error: "Error interno al crear veterinaria",
        details: error.message,
      });
    }
  },
];

// Actualizar una veterinaria
export const updateVeterinaria = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, direccion, telefono, email } = req.body;
  try {
    const actualizada = await prisma.establishment.update({
      where: { id: Number(id) },
      data: { nombre, direccion, telefono, email },
    });
    res.json(actualizada);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar veterinaria" });
  }
};

// Eliminar una veterinaria
export const deleteVeterinaria = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.establishment.delete({ where: { id: Number(id) } });
    res.json({ message: "Veterinaria eliminada" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar veterinaria" });
  }
};

