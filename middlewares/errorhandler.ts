import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const status = res.statusCode ? res.statusCode : 500;
  logger.error(err.message, { stack: err.stack });
  res.status(500).json({
    message: "Something went wrong",
    error: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
