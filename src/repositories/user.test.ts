import faker from "faker";
import userRepo, { RegisterUserPatameter } from "@/repositories/user";
import UserModel, { User } from "@/models/user";

describe("User repository: ", () => {
  let userFixture: User;
  const rawPassword = faker.random.words(2);

  beforeEach(async () => {
    await UserModel.deleteMany({});
    userFixture = await new UserModel({
      email: faker.internet.email(),
      password: rawPassword,
    } as User).save();
  });

  test("register() - Should succeed", async () => {
    const userParameter: RegisterUserPatameter = {
      email: "  userName@localhost.com  ",
      password: faker.random.words(5),
      expoToken: faker.random.word(),
    };
    const createdUser = await userRepo.register(userParameter);

    const user = await UserModel.findById(createdUser._id);
    expect(user).toMatchObject({
      email: "username@localhost.com",
      expoToken: userParameter.expoToken,
    });
    expect(user.authTokens).toHaveLength(0);
    expect(user.password).not.toBe(userParameter.password);
  });

  test("findByCredentials() - Should return a user", async () => {
    const user = await userRepo.findByCredentials(
      userFixture.email,
      rawPassword
    );

    expect(user).toMatchObject({
      _id: userFixture._id,
      email: userFixture.email.trim().toLowerCase(),
      expoToken: "",
    });
    expect(user.authTokens).toHaveLength(0);
  });

  test("findByCredentials() - Should return undefined", async () => {
    let user = await userRepo.findByCredentials(
      `diff_${userFixture.email}`,
      rawPassword
    );
    expect(user).toBeUndefined();

    user = await userRepo.findByCredentials(
      userFixture.email,
      userFixture.password
    );
    expect(user).toBeUndefined();

    user = await userRepo.findByCredentials(
      `diff_${userFixture.email}`,
      userFixture.password
    );
    expect(user).toBeUndefined();
  });

  test("generateTokenFor() - Should be generated success", async () => {
    const token = await userRepo.generateTokenFor(userFixture);
    const { authTokens } = await UserModel.findById(userFixture._id);

    // assert it've been generated
    expect(typeof token).toBe("string");
    expect(token).not.toBe("");
    // assert it've been saved in user
    expect(authTokens).toHaveLength(1);
    expect(authTokens[0].token).toBe(token);
  });
});
