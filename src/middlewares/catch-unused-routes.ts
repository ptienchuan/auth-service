import ErrorResponse from "@/libs/error-response";
import { HTTP_STATUS } from "@/constants";

const catchUnusedRoutes = (): void => {
  throw new ErrorResponse(HTTP_STATUS.NOT_FOUND);
};

export default catchUnusedRoutes;
