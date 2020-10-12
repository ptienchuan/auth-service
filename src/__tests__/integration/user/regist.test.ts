import request from "supertest";
import faker from "faker";
import app from "@/app";
import {
  HTTP_SUCCESS_STATUS,
  HTTP_FAIL_STATUS,
  HTTP_ERROR_MESSAGE,
} from "@/constants";
import UserModel from "@/models/user";

describe("POST /users/", () => {
  const parameters = {
    name: faker.random.word(),
    password: faker.random.words(2),
  };

  test("201 - Should succeed", async () => {
    const expoToken = faker.random.words(2);
    const { body } = await request(app)
      .post("/users")
      .send({ ...parameters, expoToken })
      .expect(HTTP_SUCCESS_STATUS.CREATED);

    expect(body.user).toEqual({
      name: parameters.name.trim().toLowerCase(),
      expoToken: expoToken,
    });
    expect(body).toHaveProperty("token");
    expect(body.token).not.toBe("");
  });

  test("201 - Should succeed - With empty expo token", async () => {
    const { body } = await request(app)
      .post("/users")
      .send(parameters)
      .expect(HTTP_SUCCESS_STATUS.CREATED);

    expect(body.user).toEqual({
      name: parameters.name.trim().toLowerCase(),
      expoToken: "",
    });
    expect(body).toHaveProperty("token");
    expect(body.token).not.toBe("");
  });

  test("500 - Should failed", async () => {
    jest.spyOn(UserModel.prototype, "save").mockImplementationOnce(() => {
      throw new Error();
    });
    const { body } = await request(app)
      .post("/users")
      .send(parameters)
      .expect(HTTP_FAIL_STATUS.INTERNAL_SERVER_ERROR);

    expect(body).toEqual({
      status: HTTP_FAIL_STATUS.INTERNAL_SERVER_ERROR,
      message: HTTP_ERROR_MESSAGE[HTTP_FAIL_STATUS.INTERNAL_SERVER_ERROR],
      detail: [],
    });
  });
});
