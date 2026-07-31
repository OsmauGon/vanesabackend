import { Request, Response } from "express";
export declare const getPublicProfessionals: (req: Request, res: Response) => Promise<void>;
export declare const getPrivateProfessionals: (req: Request, res: Response) => Promise<void>;
export declare const getprofessionalById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createProfessional: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>[];
export declare const updateprofessional: (req: Request, res: Response) => Promise<void>;
export declare const deleteprofessional: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=professionals.controllers.d.ts.map