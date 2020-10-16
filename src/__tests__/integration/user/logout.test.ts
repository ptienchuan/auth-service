import request from "supertest";
import faker from "faker";
import jwt from "jsonwebtoken";
import app from "@/app";
import {
  HTTP_ERROR_MESSAGE,
  HTTP_FAIL_STATUS,
  HTTP_SUCCESS_STATUS,
} from "@/constants";
import UserModel, { User } from "@/models/user";

const generateToken = (user: User, expiresIn: string | number): string => {
  const token = jwt.sign(
    { _id: user._id, name: user.name },
    process.env.JWT_PRIVATE_KEY,
    { expiresIn }
  );

  return token;
};

describe("POST /users/logout", () => {
  let token200: string;
  let tokenExpired: string;
  let tokenNotExist: string;
  let token500: string;

  beforeAll(async () => {
    const userFixture = await new UserModel({
      name: faker.random.word(),
      password: faker.random.words(2),
    } as User).save();

    token200 = generateToken(userFixture, "1h");
    tokenExpired = generateToken(userFixture, 0);
    tokenNotExist = generateToken(userFixture, "2h");
    token500 = generateToken(userFixture, "3h");
    userFixture.authTokens = [
      { token: token200 },
      { token: tokenExpired },
      { token: token500 },
    ];
    await userFixture.save();
  });

  test("200 - Should logout succeed", async () => {
    await request(app)
      .post("/users/logout")
      .set("Authorization", `Bearer ${token200}`)
      .expect(HTTP_SUCCESS_STATUS.OK);
  });

  test("401 - Should logout failed - When authorization info is not exist", async () => {
    const { body } = await request(app)
      .post("/users/logout")
      .expect(HTTP_FAIL_STATUS.UNAUTHORIZED);

    expect(body).toEqual({
      status: HTTP_FAIL_STATUS.UNAUTHORIZED,
      message: HTTP_ERROR_MESSAGE[HTTP_FAIL_STATUS.UNAUTHORIZED],
      detail: [],
    });
  });

  test("401 - Should logout failed - When token is invalid", async () => {
    const { body } = await request(app)
      .post("/users/logout")
      .set("Authorization", "Bearer tokenvalue")
      .expect(HTTP_FAIL_STATUS.UNAUTHORIZED);

    expect(body).toEqual({
      status: HTTP_FAIL_STATUS.UNAUTHORIZED,
      message: HTTP_ERROR_MESSAGE[HTTP_FAIL_STATUS.UNAUTHORIZED],
      detail: [],
    });
  });

  test("401 - Should logout failed - When token is expired", async () => {
    const { body } = await request(app)
      .post("/users/logout")
      .set("Authorization", `Bearer ${tokenExpired}`)
      .expect(HTTP_FAIL_STATUS.UNAUTHORIZED);

    expect(body).toEqual({
      status: HTTP_FAIL_STATUS.UNAUTHORIZED,
      message: HTTP_ERROR_MESSAGE[HTTP_FAIL_STATUS.UNAUTHORIZED],
      detail: [],
    });
  });

  test("401 - Should logout failed - When token is not exist", async () => {
    const { body } = await request(app)
      .post("/users/logout")
      .set("Authorization", `Bearer ${tokenNotExist}`)
      .expect(HTTP_FAIL_STATUS.UNAUTHORIZED);

    expect(body).toEqual({
      status: HTTP_FAIL_STATUS.UNAUTHORIZED,
      message: HTTP_ERROR_MESSAGE[HTTP_FAIL_STATUS.UNAUTHORIZED],
      detail: [],
    });
  });

  test("500 - Internal server error", async () => {
    jest.spyOn(UserModel.prototype, "save").mockImplementationOnce(() => {
      throw new Error();
    });
    const { body } = await request(app)
      .post("/users/logout")
      .set("Authorization", `Bearer ${token500}`)
      .expect(HTTP_FAIL_STATUS.INTERNAL_SERVER_ERROR);

    expect(body).toEqual({
      status: HTTP_FAIL_STATUS.INTERNAL_SERVER_ERROR,
      message: HTTP_ERROR_MESSAGE[HTTP_FAIL_STATUS.INTERNAL_SERVER_ERROR],
      detail: [],
    });
  });
});
