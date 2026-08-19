import { Request, Response } from "express";
export declare const getPublicServicios: (req: Request, res: Response) => Promise<void>;
export declare const getPrivateServicios: (req: Request, res: Response) => Promise<void>;
export declare const getservicioById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createServicio: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>[];
export declare const updateServicio: (req: Request, res: Response) => Promise<void>;
export declare const patchServicio: (req: Request, res: Response) => Promise<void>;
export declare const deleteServicio: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=servicio.controller.d.ts.map