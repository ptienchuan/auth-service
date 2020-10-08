import Error from "@/libs/error";
import { HTTP_STATUS, HTTP_ERROR_MESSAGE } from "@/constants";

describe("Lib Error", () => {
  test("Test function getErrorDetail()", () => {
    let error = new Error();
    expect(error.getErrorDetail()).toEqual({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: HTTP_ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
      detail: [],
    });

    error = new Error(HTTP_STATUS.NOT_FOUND);
    expect(error.getErrorDetail()).toEqual({
      status: HTTP_STATUS.NOT_FOUND,
      message: HTTP_ERROR_MESSAGE.NOT_FOUND,
      detail: [],
    });
  });
});
