import { Request, Response } from "express";
import userRepo, { RegisterUserPatameter } from "@/repositories/user";
import Error from "@/libs/error";
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

const login = async (req: Request, res: Response): Promise<Response> => {
  let token;
  const { name, password } = req.body;
  const logedInUser = await userRepo.findByCredentials(name, password);
  if (logedInUser) {
    token = await userRepo.generateTokenFor(logedInUser);
  } else {
    throw new Error(HTTP_STATUS.NOT_FOUND);
  }

  return res.status(HTTP_STATUS.OK).send({ user: logedInUser, token });
};

export default { regist, login };
