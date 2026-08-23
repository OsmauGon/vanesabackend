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


// GET todos
export const getPublicServicios = async (req: Request, res: Response) => {
  
  try {
    const servicioss = await prisma.servicio.findMany({
        select:{
            id:true,
            nombre: true,
            topico: true,
            descripcion: true,
            clase: true,
            imagenLogo: true,
            contacto: true,
            telefono: true,
            redSocial: true
        }
    })
    res.status(200).json({message: "todo bien", data: servicioss})
  } catch (error){
    console.log(error)
    res.status(500).json({error: "Error al obtener los servicios"})
  }
};
export const getPrivateServicios = async (req: Request, res: Response) => {
  
  try {
    const servicioss = await prisma.servicio.findMany()
    res.status(200).json({message: "todo bien", data: servicioss})
  } catch (error){
    console.log(error)
    res.status(500).json({error: "Error al obtener los servicios"})
  }
};
// Obtener una servicio por ID
export const getservicioById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const servicio = await prisma.servicio.findUnique({
      where: { id: Number(id) },
    });
    if (!servicio) return res.status(404).json({ error: "No encontrada" });
    res.json({message: "ENCONTRADO", data: servicio});
  } catch (error) {
    res.status(500).json({ error: "Error al obtener servicio" });
  }
};

// POST crear
export const createServicio = [
  upload.single("imagen"), // 👈 nombre del campo en el formData
  async (req: Request, res: Response) => {
    const { nombre, 
      telefono, 
      redSocial,
      topico,
      descripcion,
      contacto,
      clase,
      notas
     } = req.body;
    const file = req.file;

    if (!nombre || !topico) {
      return res.status(400).json({
        error: "Faltan credenciales obligatorias o imagen",
        data: {
          nombre, topico, telefono,
        }
      });
    }

    try {
      let uploadResult: { secure_url: string } | null = null;

      // 📤 Subir imagen a Cloudinary solo si existe
      if (file) {
        uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: "profesionales",
        });
      }

      // 🗄️ Guardar registro en DB
      const nueva = await prisma.servicio.create({
        data: {
          nombre,
          imagenLogo: uploadResult ? uploadResult.secure_url : null, // 👈 null si no hay imagen
          telefono,
          redSocial,
          descripcion,
          contacto,
          clase,
          topico, 
          notas: notas ? JSON.parse(notas) : []
        },
      });

     res.status(201).json({message: "EXITO", data: nueva});
    } catch (error: any) {
      console.error("Error al crear servicio:", error);
      res.status(500).json({
        error: "Error interno al crear servicio",
        details: error.message,
      });
    }
  },
];

// PUT actualizar completo
export const updateServicio = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, descripcion, topico, clase,contacto, redSocial, telefono } = req.body;
  try {
    const actualizado = await prisma.servicio.update({
    where: { id: Number(id) },
    data: { nombre, descripcion, topico, clase,contacto, redSocial, telefono },
  });
  res.json({message:"PUT EXITOSO", data: actualizado});
  } catch (error) {
    console.log(error)
    res.status(500).json("Error al actualizar el recurso")
  }
};

// PATCH actualizar parcial
export const patchServicio = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const actualizado = await prisma.servicio.update({
    where: { id: Number(id) },
    data: req.body,
    });
    res.json({message:"PATCH EXITOSO", data: actualizado});
  } catch (error) {
    console.log(error)
    res.status(500).json("Error al actualizar el recurso")
  }
};
/*
Necesito una funcion para hacer un PATCH que modifique explicitamente la imagen y o el finDeSuscripcion del elemento
export const patchServicio2 = [
  upload.single("imagen"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const oldServicio = await prisma.servicio.findUnique({ where: { id: Number(id) } });

      let data: any = { ...req.body };

      if (req.file) {
        // Borrar imagen anterior si existe
        if (oldServicio?.imagenId) {
          await cloudinary.uploader.destroy(oldServicio.imagenId);
        }

        // Subir nueva
        const result = await cloudinary.uploader.upload(req.file.path, { folder: "servicios" });
        data.imagen = result.secure_url;
        data.imagenId = result.public_id;
      }

      const actualizado = await prisma.servicio.update({
        where: { id: Number(id) },
        data,
      });

      res.json(actualizado);
    } catch (error) {
      res.status(400).json({ message: "Error al actualizar servicio", error });
    }
  },
];
*/

// DELETE
export const deleteServicio = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.servicio.delete({ where: { id: Number(id) } });
    res.json({ message: "servicio eliminada" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar servicio" });
  }
};
