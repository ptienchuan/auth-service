import Error from "@/libs/error";
import { HTTP_STATUS } from "@/constants";

const catchUnusedRoutes = (): void => {
  throw new Error(HTTP_STATUS.NOT_FOUND);
};

export default catchUnusedRoutes;
