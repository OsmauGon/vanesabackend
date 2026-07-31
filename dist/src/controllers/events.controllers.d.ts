import { Request, Response } from "express";
export declare const getPublicEventos: (req: Request, res: Response) => Promise<void>;
export declare const getPrivateEventos: (req: Request, res: Response) => Promise<void>;
export declare const getEventoById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createEvento: (req: Request, res: Response) => Promise<void>;
export declare const updateEvento: (req: Request, res: Response) => Promise<void>;
export declare const deleteEvento: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=events.controllers.d.ts.map