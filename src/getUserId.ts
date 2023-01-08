import { logInfo } from "./logInfo";
import { execSync } from "child_process";
import get from "lodash/get";

export const getUserId = () => {
  logInfo("Getting user id...");

  const result = execSync(`aws sts get-caller-identity`, { encoding: "utf-8" });
  const json = JSON.parse(result);
  const userId = get(json, "UserId");
  logInfo("User id: ", userId);

  return userId;
};
