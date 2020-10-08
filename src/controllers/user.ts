import { Request, Response } from "express";
import userRepo, { RegisterUserPatameter } from "@/repositories/user";
import { extractObject } from "@/libs/utilities";
import { HTTP_STATUS } from "@/constants";

const regist = async (req: Request, res: Response): Promise<Response> => {
  const userParameter = extractObject(req.body as RegisterUserPatameter, [
    "name",
    "password",
    "expoToken",
  ]);
  const user = await userRepo.register(userParameter);

  return res.status(HTTP_STATUS.CREATED).send(user);
};

export default { regist };
