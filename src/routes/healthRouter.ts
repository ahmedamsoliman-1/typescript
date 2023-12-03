import { Router , Request, Response } from "express";

export const router = Router();

router.get('/', (req: Request, res: Response ) => {
    // throw new Error('Application Error');
    res.send( 
        { 
            message: 'OK', 
            timestamp: req.timestamp 
        } 
    );

})