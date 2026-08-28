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
// Obtener todas las professionals
export const getPublicProfessionals = async (req, res) => {
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
                notas: true
            },
        });
        //gte es expresion q normalmente si querrías mostrar solo los profesionales con suscripción activa, eso se expresa con el operador gte (greater than or equal):
        res.status(200).json({ message: "todo bien", data: professionals });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al obtener professionals" });
    }
};
export const getPrivateProfessionals = async (req, res) => {
    try {
        const professionals = await prisma.professional.findMany();
        //aqui seria conveniente mantener select
        res.status(200).json({ message: "todo bien", data: professionals });
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener professionals" });
    }
};
// Obtener una professional por ID
export const getprofessionalById = async (req, res) => {
    const { id } = req.params;
    try {
        const professional = await prisma.professional.findUnique({
            where: { id: Number(id) },
        });
        if (!professional)
            return res.status(404).json({ error: "No encontrada" });
        res.json({ message: "ENCONTRADO", data: professional });
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener professional" });
    }
};
// Crear una nueva professional
export const createProfessional = [
    upload.single("imagen"), // 👈 nombre del campo en el formData
    async (req, res) => {
        const { nombre, servicios, horario, finDeSuscripcion, telefono, email, redSocial, insignias, ubicacion, notas, } = req.body;
        const file = req.file;
        if (!nombre || !servicios || !finDeSuscripcion) {
            return res.status(400).json({
                error: "Faltan credenciales obligatorias",
                data: { nombre, servicios, finDeSuscripcion },
            });
        }
        try {
            let uploadResult = null;
            // 📤 Subir imagen a Cloudinary solo si existe
            if (file) {
                uploadResult = await cloudinary.uploader.upload(file.path, {
                    folder: "profesionales",
                });
            }
            // 🗄️ Guardar registro en DB
            const nueva = await prisma.professional.create({
                data: {
                    nombre,
                    servicios: JSON.parse(servicios),
                    horario,
                    imagen: uploadResult ? uploadResult.secure_url : null, // 👈 null si no hay imagen
                    finDeSuscripcion: new Date(finDeSuscripcion),
                    telefono,
                    insignias: insignias ? JSON.parse(insignias) : [],
                    email,
                    ubicacion,
                    redSocial,
                    notas: notas ? JSON.parse(notas) : []
                },
            });
            res.status(201).json({ message: "EXITO", data: nueva });
        }
        catch (error) {
            console.error("Error al crear profesional:", error);
            res.status(500).json({
                error: "Error interno al crear profesional",
                details: error.message,
            });
        }
    },
];
// Actualizar una professional
export const updateprofessional = async (req, res) => {
    const { id } = req.params;
    const { nombre, horario, servicios, telefono, email, redSocial, finDeSuscripcion, insignias, ubicacion, notas } = req.body;
    try {
        const antiguo = await prisma.establishment.findUnique({ where: { id: Number(id) } });
        const actualizada = await prisma.professional.update({
            where: { id: Number(id) },
            data: { nombre, horario, telefono, email, redSocial, finDeSuscripcion, ubicacion,
                servicios: servicios ? servicios : antiguo?.servicios,
                insignias: insignias ? insignias : antiguo?.insignias,
                notas: notas ? notas : antiguo?.notas,
            },
        });
        res.json({ message: "PUT EXITOSO", data: actualizada });
    }
    catch (error) {
        console.log(error);
        res.status(500).json("Error al actualizar el recurso");
    }
};
export const patchProfesionalSuscripcion = async (req, res) => {
    /*
    Este PATCH ea unicamente para actualizar exclusivamente al campo finDeSuscripcion del un registro de Servicio
    */
    const { id } = req.params;
    try {
        // Extraemos la fecha del body
        const { finDeSuscripcion } = req.body;
        // Construimos el objeto data
        const data = {};
        if (finDeSuscripcion) {
            // Convertimos el string a Date
            data.finDeSuscripcion = new Date(finDeSuscripcion);
        }
        // Si en el futuro llegan más campos, podés mergearlos:
        // Object.assign(data, req.body);
        const actualizado = await prisma.professional.update({
            where: { id: Number(id) },
            data,
        });
        res.json({ message: "PATCH EXITOSO", data: actualizado });
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Error al actualizar el recurso");
    }
};
export const patchProfesionalImagen = [
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
            const oldServicio = await prisma.professional.findUnique({
                where: { id: Number(id) },
            });
            let data = { ...req.body };
            if (req.file) {
                // Si hay imagen nueva, borrar la anterior
                if (oldServicio?.imagen) {
                    await cloudinary.uploader.destroy(oldServicio.imagen);
                }
                // Subir nueva imagen
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: "servicios", // 👈 carpeta en Cloudinary
                });
                // Guardar URL y public_id
                data.imagen = result.secure_url;
                data.imagenId = result.public_id;
            }
            const actualizado = await prisma.professional.update({
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
// Eliminar una professional
export const deleteprofessional = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.professional.delete({ where: { id: Number(id) } });
        res.json({ message: "professional eliminada" });
    }
    catch (error) {
        res.status(500).json({ error: "Error al eliminar professional" });
    }
};
//# sourceMappingURL=professionals.controllers.js.map