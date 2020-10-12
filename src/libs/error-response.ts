import { HTTP_FAIL_STATUS, HTTP_ERROR_MESSAGE } from "@/constants";

interface ErrorDetail {
  status: HTTP_FAIL_STATUS;
  message: string;
  detail: [];
}

class ErrorResponse extends Error {
  status: HTTP_FAIL_STATUS;
  message: string;
  detail: [];

  constructor(status?: HTTP_FAIL_STATUS) {
    super();
    this.status = status || HTTP_FAIL_STATUS.INTERNAL_SERVER_ERROR;
    this.message = HTTP_ERROR_MESSAGE[this.status] || "";
  }

  getErrorDetail(): ErrorDetail {
    return {
      status: this.status,
      message: this.message || "",
      detail: this.detail || [],
    };
  }
}

export default ErrorResponse;
