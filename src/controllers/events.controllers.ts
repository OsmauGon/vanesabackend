import { Request, Response } from "express";
import { prisma } from '../utils/prisma.js' // instancia de Prisma

// Obtener todas las Eventos
export const getPublicEventos = async (req: Request, res: Response) => {
  try {
    const today = new Date();

    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(
      threeMonthsAgo.getMonth() - 3
    );

    const events = await prisma.event.findMany({
      /*Lo borramos por ahora poruqe fecha es un string y gte necesita Date
      where: {
          fecha: {
            gte: threeMonthsAgo,
          },
        },
        orderBy: {
          fecha: "asc",
        },
      });
      */
      orderBy: {
        fecha: "asc",
      },
    });

   res.status(200).json({message: "todo bien", data: events});
  } catch (error) {
    res.status(500).json({ error: "Error al obtener Eventos" });
  }
};
export const getPrivateEventos = async (req: Request, res: Response) => {
  try {
    const eventos = await prisma.event.findMany();
     res.status(200).json({message: "todo bien", data: eventos});
  } catch (error) {
    res.status(500).json({ error: "Error al obtener Eventos" });
  }
};
// Obtener una Evento por ID
export const getEventoById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const Evento = await prisma.event.findUnique({
      where: { id: Number(id) },
    });
    if (!Evento) return res.status(404).json({ error: "No encontrada" });
    res.json(Evento);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener Evento" });
  }
};

// Crear una nueva Evento
export const createEvento = async (req: Request, res: Response) => {
  
  const { titulo, fecha, hora, tipo, responsable, ubicacion, contacto } = req.body
  if (!titulo || !fecha || !hora || !ubicacion || !contacto) {
      return res.status(400).json({
        error: "Faltan credenciales obligatorias o imagen",
        data: {
          titulo, fecha, hora, tipo, responsable, ubicacion, contacto 
        }
      });
    };
  try {
    const nueva = await prisma.event.create({
      data: { titulo, fecha, hora, tipo, responsable, ubicacion, contacto }
    });
    res.status(201).json({message: "EXITO", data: nueva});
  } catch (error: any) {
    console.error("Error al crear evento:", error);
      res.status(500).json({
        error: "Error interno al crear evento",
        details: error.message,
      });
  } 
};

// Actualizar una Evento
export const updateEvento = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { titulo, hora, fecha, tipo, responsable,ubicacion,contacto } = req.body;
  try {
    const actualizado = await prisma.event.update({
      where: { id: Number(id) },
      data: { titulo, hora, fecha, tipo, responsable,ubicacion,contacto },
    });
    res.json({message:"PUT EXITOSO", data: actualizado});
  } catch (error) {
    console.log(error)
    res.status(500).json("Error al actualizar el recurso")
  }
};

// Eliminar una Evento
export const deleteEvento = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.event.delete({ where: { id: Number(id) } });
    res.json({ message: "Evento eliminada" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar Evento" });
  }
};





