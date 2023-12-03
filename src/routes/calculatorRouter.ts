import { Router, Request, Response } from "express";

export const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send( { message: 'Get All Calculation', 
    timestamp: req.timestamp,
    data: 
    [ 
        { id: 1, result: 1 },
        { id: 2, result: 2 }
    ]
  } );
});

router.get('/:id', (req: Request, res: Response) => {
    res.send({
        message: 'Get Calculation by UD', 
        timestamp: req.timestamp,
        id: req.params.id, result: 1,
    });
});