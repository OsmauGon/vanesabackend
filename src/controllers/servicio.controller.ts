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
      notas,
      finDeSuscripcion
     } = req.body;
    const file = req.file;
    if (!nombre || !topico || !telefono || !finDeSuscripcion || !clase) {
      console.log("falta algo obligatorio", req.body)
      return res.status(400).json({
        error: "Faltan credenciales obligatorias o imagen",
        data: {
          nombre, topico, telefono, finDeSuscripcion, clase
        }
      });
    }

    try {
      let uploadResult: { secure_url: string } | null = null;
		console.log("ingresamos al try y tenemos  definido lo de la url de la imagen", uploadResult)
      // 📤 Subir imagen a Cloudinary solo si existe
      if (file) {
        uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: "profesionales",
        });
      }
	console.log("guardamos satisfactoriamente la imagen")
	
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
          notas: notas ? JSON.parse(notas) : [],
          finDeSuscripcion: new Date(finDeSuscripcion),
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
  const { nombre, descripcion, topico, clase,contacto, redSocial, telefono,finDeSuscripcion, notas } = req.body;
  try {
    const antiguo = await prisma.servicio.findUnique({where:{id: Number(id)}})
    const actualizado = await prisma.servicio.update({
    where: { id: Number(id) },
    data: { nombre, descripcion, topico, clase,contacto, redSocial, telefono,finDeSuscripcion,
        notas: notas ? notas: antiguo?.notas, },
  });
  res.json({message:"PUT EXITOSO", data: actualizado});
  } catch (error) {
    console.log(error)
    res.status(500).json("Error al actualizar el recurso")
  }
};

// PATCH actualizar parcial
export const patchServicioSuscripcion = async (req: Request, res: Response) => {
  /*
  Este PATCH ea unicamente para actualizar exclusivamente al campo finDeSuscripcion del un registro de Servicio
  */
  const { id } = req.params;
  try {
    // Extraemos la fecha del body
    const { finDeSuscripcion } = req.body;

    // Construimos el objeto data
    const data: any = {};

    if (finDeSuscripcion) {
      // Convertimos el string a Date
      data.finDeSuscripcion = new Date(finDeSuscripcion);
    }

    // Si en el futuro llegan más campos, podés mergearlos:
    // Object.assign(data, req.body);

    const actualizado = await prisma.servicio.update({
      where: { id: Number(id) },
      data,
    });

    res.json({ message: "PATCH EXITOSO", data: actualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error al actualizar el recurso");
  }
};
export const patchServicioImagen = [
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
      const oldServicio = await prisma.servicio.findUnique({
        where: { id: Number(id) },
      });

      let data: any = { ...req.body };

      if (req.file) {
        // Si hay imagen nueva, borrar la anterior
        if (oldServicio?.imagenLogo) {
          await cloudinary.uploader.destroy(oldServicio.imagenLogo);
        }

        // Subir nueva imagen
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "servicios", // 👈 carpeta en Cloudinary
        });

        // Guardar URL y public_id
        data.imagen = result.secure_url;
        data.imagenId = result.public_id;
      }

      const actualizado = await prisma.servicio.update({
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
