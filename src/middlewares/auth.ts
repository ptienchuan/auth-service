import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import UserModel, { User } from "@/models/user";
import ErrorResponse from "@/libs/error-response";
import { log } from "@/libs/utilities";
import { HTTP_FAIL_STATUS } from "@/constants";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const { _id } = jwt.verify(token, process.env.JWT_PRIVATE_KEY) as Partial<
      User
    >;
    const user = await UserModel.findOne({ _id });
    const authTokens = user.authTokens.map(({ token }) => token.toString());
    if (!authTokens.includes(token)) {
      throw new Error("Token was deleteted");
    }

    req.body.auth = { user, token };

    next();
  } catch (error) {
    log("Authentication error: ", error);
    next(new ErrorResponse(HTTP_FAIL_STATUS.UNAUTHORIZED));
  }
};

export default auth;
