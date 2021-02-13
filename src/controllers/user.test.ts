import httpMocks from "node-mocks-http";
import faker from "faker";
import userController from "@/controllers/user";
import UserModel, { User } from "@/models/user";

describe("User Controller", () => {
  let userFixture: User;
  const res = httpMocks.createResponse();
  const userFixtureParameter = {
    email: faker.internet.email(),
    password: faker.random.words(2),
  } as User;

  beforeEach(async () => {
    await UserModel.deleteMany({});
    userFixture = await new UserModel(userFixtureParameter).save();
  });

  test("Action regist(): Should succeed", async () => {
    const body = {
      email: faker.internet.email(),
      password: faker.random.words(5),
      expoToken: faker.random.word(),
    };
    const req = httpMocks.createRequest({ body });
    await userController.regist(req, res);
    const createdUser = await UserModel.findOne({ email: body.email });

    expect(createdUser).toMatchObject({
      email: body.email.trim().toLowerCase(),
      expoToken: body.expoToken,
    });
    expect(createdUser.authTokens).toHaveLength(1);
    expect(createdUser.password).not.toEqual(body.password);
  });

  test("Action regist(): Should failed", async () => {
    let req = httpMocks.createRequest({ body: {} });
    await expect(userController.regist(req, res)).rejects.toThrowError();

    req = httpMocks.createRequest({ body: { name: "username" } });
    await expect(userController.regist(req, res)).rejects.toThrowError();

    req = httpMocks.createRequest({
      body: { password: faker.random.word() },
    });
    await expect(userController.regist(req, res)).rejects.toThrowError();
  });

  test("Action login(): Should succeed", async () => {
    const req = httpMocks.createRequest({
      body: {
        email: userFixtureParameter.email,
        password: userFixtureParameter.password,
      },
    });
    await userController.login(req, res);

    const { authTokens } = await UserModel.findById(userFixture._id);
    expect(authTokens).toHaveLength(1);
    expect(typeof authTokens[0].token).toBe("string");
    expect(authTokens[0].token).not.toBe("");
  });

  test("Action login(): Should failed", async () => {
    let req = httpMocks.createRequest({
      body: {
        email: `diff_${userFixtureParameter.email}`,
        password: userFixtureParameter.password,
      },
    });
    await expect(userController.login(req, res)).rejects.toThrowError();

    req = httpMocks.createRequest({
      body: {
        email: userFixtureParameter.email,
        password: `${userFixtureParameter.password}_diff`,
      },
    });
    await expect(userController.login(req, res)).rejects.toThrowError();
  });

  test("Action logout(): Should success", async () => {
    userFixture.authTokens = [{ token: "token1" }, { token: "token2" }];
    await userFixture.save();

    const req = httpMocks.createRequest({
      body: {
        auth: {
          user: userFixture,
          token: "token1",
        },
      },
    });
    await userController.logout(req, res);

    const { authTokens } = await UserModel.findById(userFixture._id);
    expect(authTokens).toHaveLength(1);
    expect(authTokens[0].token).toBe("token2");
  });

  test("Action logout(): Should not throw error when token not exist", async () => {
    userFixture.authTokens = [{ token: "token1" }];
    await userFixture.save();

    const req = httpMocks.createRequest({
      body: {
        auth: {
          user: userFixture,
          token: "token2",
        },
      },
    });
    await userController.logout(req, res);

    const { authTokens } = await UserModel.findById(userFixture._id);
    expect(authTokens).toHaveLength(1);
    expect(authTokens[0].token).toBe("token1");
  });

  test("Action logoutAll(): Should success", async () => {
    userFixture.authTokens = [{ token: "token1" }, { token: "token2" }];
    await userFixture.save();

    const req = httpMocks.createRequest({
      body: {
        auth: {
          user: userFixture,
          token: "token1",
        },
      },
    });
    await userController.logoutAll(req, res);

    const { authTokens } = await UserModel.findById(userFixture._id);
    expect(authTokens).toHaveLength(0);
  });
});
