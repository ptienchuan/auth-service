import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel, { User } from "@/models/user";

interface RegisterUserPatameter {
  name: string;
  password: string;
  expoToken?: string;
}

const register = async ({
  name,
  password,
  expoToken,
}: RegisterUserPatameter): Promise<User> => {
  const user = new UserModel({
    name,
    password,
    expoToken,
  } as User);
  const newUser = await user.save();

  return newUser;
};

const findByCredentials = async (
  name: string,
  password: string
): Promise<User | undefined> => {
  const user = await UserModel.findOne({ name });
  const validCredentials =
    user && (await bcrypt.compare(password, user.password));

  return validCredentials ? user : undefined;
};

const generateTokenFor = async (user: User): Promise<string> => {
  const token = jwt.sign(
    { _id: user._id, name: user.name },
    process.env.JWT_PRIVATE_KEY,
    { expiresIn: "24h" }
  );
  user.authTokens = user.authTokens.concat({ token });
  await user.save();

  return token;
};

export { RegisterUserPatameter };
export default { register, findByCredentials, generateTokenFor };
