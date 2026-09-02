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
// Obtener todas las veterinarias
export const getPrivateVeterinarias = async (req, res) => {
    try {
        const veterinarias = await prisma.establishment.findMany();
        res.json({ message: "todo bien", data: veterinarias });
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener todas las veterinarias", data: error });
    }
};
export const getPublicVeterinarias = async (req, res) => {
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
                longitud: true,
                notas: true
            },
        });
        /* const veterinarias = await prisma.veterinaria.findMany() */
        res.status(200).json({ message: "todo bien", data: veterinarias });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al obtener veterinarias publicas", data: error });
    }
};
// Obtener una veterinaria por ID
export const getVeterinariaById = async (req, res) => {
    const { id } = req.params;
    try {
        const veterinaria = await prisma.establishment.findUnique({
            where: { id: Number(id) },
        });
        if (!veterinaria)
            return res.status(404).json({ error: "No encontrada" });
        res.json(veterinaria);
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener veterinaria" });
    }
};
// Crear una nueva veterinaria
export const createVeterinaria = [
    upload.single("imagen"), // 👈 nombre del campo en el formData
    async (req, res) => {
        const { nombre, servicios, horario, finDeSuscripcion, telefono, email, redSocial, insignias, profesionalesVinculados, ubicacion, latitud, longitud, notas } = req.body;
        const file = req.file;
        if (!nombre || !servicios || !horario || !finDeSuscripcion || !ubicacion) {
            return res.status(400).json({
                error: "Faltan credenciales obligatorias",
                data: {
                    nombre,
                    servicios,
                    horario,
                    finDeSuscripcion,
                    ubicacion
                }
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
            const nueva = await prisma.establishment.create({
                data: {
                    ubicacion,
                    nombre,
                    servicios: JSON.parse(servicios),
                    horario,
                    imagen: uploadResult ? uploadResult.secure_url : null, // 👈 null si no hay imagen
                    finDeSuscripcion: new Date(finDeSuscripcion),
                    telefono: telefono ? JSON.parse(telefono) : [],
                    insignias: insignias ? JSON.parse(insignias) : [],
                    profesionalesVinculados: profesionalesVinculados ? JSON.parse(profesionalesVinculados) : [],
                    email,
                    redSocial,
                    latitud: parseFloat(latitud),
                    longitud: parseFloat(longitud),
                    notas: notas ? JSON.parse(notas) : []
                },
            });
            res.status(201).json({ message: "EXITO", data: nueva });
        }
        catch (error) {
            console.error("Error al crear veterinaria:", error);
            res.status(500).json({
                error: "Error interno al crear veterinaria",
                details: error.message,
            });
        }
    },
];
// Actualizar una veterinaria
export const updateVeterinaria = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, horario, redSocial, ubicacion, latitud, longitud, telefono, servicios, insignias, profesionalesVinculados, notas, finDeSuscripcion } = req.body;
    try {
        const antiguo = await prisma.establishment.findUnique({ where: { id: Number(id) } });
        const actualizado = await prisma.establishment.update({
            where: { id: Number(id) },
            data: { nombre,
                email,
                horario,
                redSocial,
                ubicacion,
                finDeSuscripcion: new Date(finDeSuscripcion),
                latitud: parseFloat(latitud),
                longitud: parseFloat(longitud),
                telefono: telefono ? telefono : antiguo?.telefono,
                servicios: servicios ? servicios : antiguo?.servicios,
                insignias: insignias ? insignias : antiguo?.insignias,
                notas: notas ? notas : antiguo?.notas,
                profesionalesVinculados: profesionalesVinculados ? profesionalesVinculados : antiguo?.profesionalesVinculados,
            },
        });
        res.json({ message: "PUT EXITOSO", data: actualizado });
    }
    catch (error) {
        console.log(error);
        res.status(500).json("Error al actualizar el recurso");
    }
};
export const patchEstablecimientoSuscripcion = async (req, res) => {
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
        const actualizado = await prisma.establishment.update({
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
export const patchEstablecimientoImagen = [
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
            const oldServicio = await prisma.establishment.findUnique({
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
                //data.imagenId = result.public_id;
            }
            const actualizado = await prisma.establishment.update({
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
// Eliminar una veterinaria
export const deleteVeterinaria = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.establishment.delete({ where: { id: Number(id) } });
        res.json({ message: "Veterinaria eliminada" });
    }
    catch (error) {
        res.status(500).json({ error: "Error al eliminar veterinaria" });
    }
};
//# sourceMappingURL=veterinaria.controller.js.map