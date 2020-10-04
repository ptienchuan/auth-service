import { HTTP_STATUS, HTTP_ERROR_MESSAGE } from "@/constants";

interface ErrorDetail {
  status: HTTP_STATUS;
  message: string;
  detail: [];
}

class Error {
  private status: HTTP_STATUS;
  private message: string;
  private detail: [];

  constructor(status: HTTP_STATUS = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    this.status = status;
    switch (status) {
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

export default Error;
