import ErrorResponse from "@/libs/error-response";
import { HTTP_FAIL_STATUS, HTTP_ERROR_MESSAGE } from "@/constants";

describe("Lib Error", () => {
  test("Test function getErrorDetail()", () => {
    let error = new ErrorResponse();
    expect(error.getErrorDetail()).toEqual({
      status: HTTP_FAIL_STATUS.INTERNAL_SERVER_ERROR,
      message: HTTP_ERROR_MESSAGE[HTTP_FAIL_STATUS.INTERNAL_SERVER_ERROR],
      detail: [],
    });

    error = new ErrorResponse(HTTP_FAIL_STATUS.NOT_FOUND);
    expect(error.getErrorDetail()).toEqual({
      status: HTTP_FAIL_STATUS.NOT_FOUND,
      message: HTTP_ERROR_MESSAGE[HTTP_FAIL_STATUS.NOT_FOUND],
      detail: [],
    });
  });
});
