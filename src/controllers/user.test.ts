import httpMocks from "node-mocks-http";
import faker from "faker";
import userController from "@/controllers/user";
import UserModel, { User } from "@/models/user";

describe("User Controller", () => {
  const res = httpMocks.createResponse();

  beforeEach(async () => {
    await UserModel.deleteMany({});
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
    const userParameter = {
      name: faker.random.word(),
      password: faker.random.words(2),
    } as User;
    const { _id } = await new UserModel(userParameter).save();

    const req = httpMocks.createRequest({ body: userParameter });
    await userController.login(req, res);

    const { authTokens } = await UserModel.findById(_id);
    expect(authTokens).toHaveLength(1);
    expect(typeof authTokens[0].token).toBe("string");
    expect(authTokens[0].token).not.toBe("");
  });
});
