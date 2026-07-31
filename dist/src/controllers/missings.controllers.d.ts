import { Request, Response } from "express";
export declare const getmissingPosts: (req: Request, res: Response) => Promise<void>;
export declare const getmissingPostById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createmissingPost: (req: Request, res: Response) => Promise<void>;
export declare const updatemissingPost: (req: Request, res: Response) => Promise<void>;
export declare const deletemissingPost: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=missings.controllers.d.ts.map