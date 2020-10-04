/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import Error from "@/libs/error";
import { log } from "@/libs/utilities";

const errorHandler = (
  error: Error | any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  log(error);
  const errorDetail =
    error instanceof Error
      ? error.getErrorDetail()
      : new Error().getErrorDetail();
  res.status(errorDetail.status).send(errorDetail);
};

export default errorHandler;
