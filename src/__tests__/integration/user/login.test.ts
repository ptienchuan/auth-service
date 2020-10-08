import request from "supertest";
import faker from "faker";
import app from "@/app";
import UserModel, { User } from "@/models/user";
import { HTTP_ERROR_MESSAGE, HTTP_STATUS } from "@/constants";

describe("POST /users/login", () => {
  const userParameter = {
    name: faker.random.word(),
    password: faker.random.words(2),
  } as User;

  beforeEach(async () => {
    await new UserModel(userParameter).save();
  });

  test("200 - Should succeed", async () => {
    const { body } = await request(app)
      .post("/users/login")
      .send(userParameter)
      .expect(HTTP_STATUS.OK);

    expect(body.user).toMatchObject({
      name: userParameter.name.trim().toLowerCase(),
      expoToken: "",
    });
    expect(typeof body.token).toBe("string");
    expect(body.token).not.toBe("");
  });

  test("404 - Should failed because of invalid password", async () => {
    const { body } = await request(app)
      .post("/users/login")
      .send({ ...userParameter, password: "123" })
      .expect(HTTP_STATUS.NOT_FOUND);

    expect(body).toMatchObject({
      status: HTTP_STATUS.NOT_FOUND,
      message: HTTP_ERROR_MESSAGE.NOT_FOUND,
      detail: [],
    });
  });

  test("404 - Should failed because of invalid name", async () => {
    const { body } = await request(app)
      .post("/users/login")
      .send({ ...userParameter, name: "123" })
      .expect(HTTP_STATUS.NOT_FOUND);

    expect(body).toMatchObject({
      status: HTTP_STATUS.NOT_FOUND,
      message: HTTP_ERROR_MESSAGE.NOT_FOUND,
      detail: [],
    });
  });

  test("500 - Internal server error", async () => {
    jest.spyOn(UserModel.prototype, "save").mockImplementationOnce(() => {
      throw new Error();
    });
    const { body } = await request(app)
      .post("/users/login")
      .send(userParameter)
      .expect(HTTP_STATUS.INTERNAL_SERVER_ERROR);

    expect(body).toEqual({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: HTTP_ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
      detail: [],
    });
  });
});
