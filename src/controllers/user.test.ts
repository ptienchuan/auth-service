import httpMocks from "node-mocks-http";
import faker from "faker";
import userController from "@/controllers/user";
import UserModel, { User } from "@/models/user";

describe("User Controller", () => {
  let userFixture: User;
  const res = httpMocks.createResponse();
  const userFixtureParameter = {
    name: faker.random.word(),
    password: faker.random.words(2),
  } as User;

  beforeEach(async () => {
    await UserModel.deleteMany({});
    userFixture = await new UserModel(userFixtureParameter).save();
  });

  test("Action regist(): Should succeed", async () => {
    const body = {
      name: "username",
      password: faker.random.words(5),
      expoToken: faker.random.word(),
    };
    const req = httpMocks.createRequest({ body });
    await userController.regist(req, res);
    const createdUser = await UserModel.findOne({ name: body.name });

    expect(createdUser).toMatchObject({
      name: body.name.trim().toLowerCase(),
      expoToken: body.expoToken,
    });
    expect(createdUser.authTokens).toHaveLength(0);
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
        name: userFixtureParameter.name,
        password: userFixtureParameter.password,
      },
    });
    await userController.login(req, res);

    const { authTokens } = await UserModel.findById(userFixture._id);
    expect(authTokens).toHaveLength(1);
    expect(typeof authTokens[0].token).toBe("string");
    expect(authTokens[0].token).not.toBe("");
  });

  test.only("Action login(): Should failed", async () => {
    let req = httpMocks.createRequest({
      body: {
        name: `${userFixtureParameter.name}_diff`,
        password: userFixtureParameter.password,
      },
    });
    await expect(userController.login(req, res)).rejects.toThrowError();

    req = httpMocks.createRequest({
      body: {
        name: userFixtureParameter.name,
        password: `${userFixtureParameter.password}_diff`,
      },
    });
    await expect(userController.login(req, res)).rejects.toThrowError();
  });
});
