import bcrypt from "bcrypt";
import UserModel, { User } from "@/models/user";

interface RegisterUserPatameter {
  name: string;
  password: string;
  expoToken: string;
}

const register = async ({
  name,
  password,
  expoToken,
}: RegisterUserPatameter): Promise<User> => {
  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.SALT_ROUNDS)
  );
  const user = new UserModel({
    name,
    password: hashedPassword,
    expoToken,
  } as User);
  const newUser = await user.save();
  return newUser;
};

export { register, RegisterUserPatameter };
