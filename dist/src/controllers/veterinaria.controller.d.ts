import { Request, Response } from "express";
export declare const getPrivateVeterinarias: (req: Request, res: Response) => Promise<void>;
export declare const getPublicVeterinarias: (req: Request, res: Response) => Promise<void>;
export declare const getVeterinariaById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createVeterinaria: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>[];
export declare const updateVeterinaria: (req: Request, res: Response) => Promise<void>;
export declare const patchVeterinaria: (req: Request, res: Response) => Promise<void>;
export declare const deleteVeterinaria: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=veterinaria.controller.d.ts.map