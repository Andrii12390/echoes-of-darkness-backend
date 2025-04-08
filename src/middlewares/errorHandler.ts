import { NextFunction, Request, Response } from 'express';

interface CustomError extends Error {
  status?: number;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;

  const message = err.message || 'Internal server error';

  res.status(status).json({ error: message });
};

export { errorHandler };