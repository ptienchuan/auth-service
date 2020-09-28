import faker from "faker";
import { register, RegisterUserPatameter } from "@/repositories/user";
import UserModel from "@/models/user";

describe("User repository: ", () => {
  test("register() - Should succeed", async () => {
    const userParameter: RegisterUserPatameter = {
      name: "  user_Name  ",
      password: faker.random.words(5),
      expoToken: faker.random.word(),
    };
    const createdUser = await register(userParameter);

    const user = await UserModel.findById(createdUser._id);
    expect(user).toMatchObject({
      name: "user_name",
      expoToken: userParameter.expoToken,
    });
    expect(user.authTokens).toHaveLength(0);
    expect(user.password).not.toBe(userParameter.password);
  });
});
