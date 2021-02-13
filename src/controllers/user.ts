import { Request, Response } from "express";
import userRepo, { RegisterUserPatameter } from "@/repositories/user";
import { User } from "@/models/user";
import ErrorResponse from "@/libs/error-response";
import { extractObject } from "@/libs/utilities";
import { HTTP_SUCCESS_STATUS, HTTP_FAIL_STATUS } from "@/constants";

const regist = async (req: Request, res: Response): Promise<Response> => {
  const userParameter = extractObject(req.body as RegisterUserPatameter, [
    "email",
    "password",
    "expoToken",
  ]);
  const user = await userRepo.register(userParameter);
  const token = await userRepo.generateTokenFor(user);

  return res.status(HTTP_SUCCESS_STATUS.CREATED).send({ user, token });
};

const login = async (req: Request, res: Response): Promise<Response> => {
  let token: string;
  const { email, password }: Pick<User, "email" | "password"> = req.body;
  const logedInUser = await userRepo.findByCredentials(email, password);
  if (logedInUser) {
    token = await userRepo.generateTokenFor(logedInUser);
  } else {
    throw new ErrorResponse(HTTP_FAIL_STATUS.NOT_FOUND);
  }

  return res.status(HTTP_SUCCESS_STATUS.OK).send({ user: logedInUser, token });
};

const logout = async (req: Request, res: Response): Promise<Response> => {
  const user = req.body.auth.user as User;
  const token = req.body.auth.token as string;
  user.authTokens = user.authTokens.filter(
    (authToken) => authToken.token !== token
  );
  await user.save();

  return res.sendStatus(HTTP_SUCCESS_STATUS.OK);
};

const logoutAll = async (req: Request, res: Response): Promise<Response> => {
  const user = req.body.auth.user as User;
  user.authTokens = [];
  await user.save();

  return res.sendStatus(HTTP_SUCCESS_STATUS.OK);
};

export default { regist, login, logout, logoutAll };
