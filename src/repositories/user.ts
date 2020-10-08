import bcrypt from "bcrypt";
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

export { RegisterUserPatameter };
export default { register, findByCredentials };
