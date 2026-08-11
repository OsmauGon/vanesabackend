import { Request, Response } from "express";
export declare const getPublicBlogs: (req: Request, res: Response) => Promise<void>;
export declare const getPrivateBlogs: (req: Request, res: Response) => Promise<void>;
export declare const getblogById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createblog: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>[];
export declare const updateblog: (req: Request, res: Response) => Promise<void>;
export declare const deleteblog: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=blogs.controllers.d.ts.map