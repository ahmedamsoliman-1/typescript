import { Request, Response, NextFunction } from "express";

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  console.log(error);
  res.sendStatus(500);
}