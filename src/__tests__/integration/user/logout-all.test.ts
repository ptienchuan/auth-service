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

describe("POST /users/logout-all", () => {
  let tokenFine: string;
  let tokenExpired: string;
  let tokenNotExist: string;

  beforeEach(async () => {
    const userFixture = await new UserModel({
      name: `${faker.random.word()}-${faker.random.number(1000)}`,
      password: faker.random.words(2),
    } as User).save();

    tokenFine = generateToken(userFixture, "1h");
    tokenExpired = generateToken(userFixture, 0);
    tokenNotExist = generateToken(userFixture, "2h");

    userFixture.authTokens = [{ token: tokenFine }, { token: tokenExpired }];
    await userFixture.save();
  });

  test("200 - Should logout succeed", async () => {
    await request(app)
      .post("/users/logout-all")
      .set("Authorization", `Bearer ${tokenFine}`)
      .expect(HTTP_SUCCESS_STATUS.OK);
  });

  test("401 - Should logout failed - When authorization info is not exist", async () => {
    const { body } = await request(app)
      .post("/users/logout-all")
      .expect(HTTP_FAIL_STATUS.UNAUTHORIZED);

    expect(body).toEqual({
      status: HTTP_FAIL_STATUS.UNAUTHORIZED,
      message: HTTP_ERROR_MESSAGE[HTTP_FAIL_STATUS.UNAUTHORIZED],
      detail: [],
    });
  });

  test("401 - Should logout failed - When token is invalid", async () => {
    const { body } = await request(app)
      .post("/users/logout-all")
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
      .post("/users/logout-all")
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
      .post("/users/logout-all")
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
      .post("/users/logout-all")
      .set("Authorization", `Bearer ${tokenFine}`)
      .expect(HTTP_FAIL_STATUS.INTERNAL_SERVER_ERROR);

    expect(body).toEqual({
      status: HTTP_FAIL_STATUS.INTERNAL_SERVER_ERROR,
      message: HTTP_ERROR_MESSAGE[HTTP_FAIL_STATUS.INTERNAL_SERVER_ERROR],
      detail: [],
    });
  });
});
