import { HTTP_STATUS, HTTP_ERROR_MESSAGE } from "@/constants";

interface ErrorDetail {
  status: HTTP_STATUS;
  message: string;
  detail: [];
}

class ErrorResponse extends Error {
  status: HTTP_STATUS;
  message: string;
  detail: [];

  constructor(status?: HTTP_STATUS) {
    super();
    this.status = status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    switch (this.status) {
      case HTTP_STATUS.NOT_FOUND:
        this.message = HTTP_ERROR_MESSAGE.NOT_FOUND;
        break;
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        this.message = HTTP_ERROR_MESSAGE.INTERNAL_SERVER_ERROR;
        break;
      default:
        this.message = "";
        break;
    }
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
