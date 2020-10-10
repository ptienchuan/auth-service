/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import ErrorResponse from "@/libs/error-response";
import { log } from "@/libs/utilities";

const errorHandler = (
  error: Error | any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let errorDetail;
  if (error instanceof ErrorResponse) {
    errorDetail = error.getErrorDetail();
  } else {
    log("From error-handler: ", error);
    errorDetail = new ErrorResponse().getErrorDetail();
  }

  res.status(errorDetail.status).send(errorDetail);
};

export default errorHandler;
