import { Request, Response } from "express";
export declare const getPublicPublicidads: (req: Request, res: Response) => Promise<void>;
export declare const getPrivatePublicidads: (req: Request, res: Response) => Promise<void>;
export declare const getpublicidadById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createpublicidad: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>[];
export declare const updatepublicidad: (req: Request, res: Response) => Promise<void>;
export declare const patchPublicidad: (req: Request, res: Response) => Promise<void>;
export declare const deletepublicidad: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=publicidad.controllers.d.ts.map