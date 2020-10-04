import httpMocks from "node-mocks-http";
import faker from "faker";
import userController from "@/controllers/user";
import UserModel from "@/models/user";

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
});
