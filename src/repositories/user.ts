import bcrypt from "bcrypt";
import User, { IUser } from "@/models/user";

interface IRegisterUserPatameter {
  name: string;
  password: string;
  expoToken: string;
}

const register = async ({
  name,
  password,
  expoToken,
}: IRegisterUserPatameter): Promise<IUser> => {
  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.SALT_ROUNDS)
  );
  const user = new User({ name, password: hashedPassword, expoToken } as IUser);
  const newUser = await user.save();
  return newUser;
};

export { register, IRegisterUserPatameter };
