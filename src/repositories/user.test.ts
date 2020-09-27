import faker from "faker";
import { register, IRegisterUserPatameter } from "@/repositories/user";
import User from "@/models/user";

describe("User repository: ", () => {
  test("register() - Should succeed", async () => {
    const userParameter: IRegisterUserPatameter = {
      name: "  user_Name  ",
      password: faker.random.words(5),
      expoToken: faker.random.word(),
    };
    const createdUser = await register(userParameter);

    const user = await User.findById(createdUser._id);
    expect(user).toMatchObject({
      name: "user_name",
      expoToken: userParameter.expoToken,
    });
    expect(user.authTokens).toHaveLength(0);
    expect(user.password).not.toBe(userParameter.password);
  });
});
