import { logInfo } from "./logInfo";
import { execSync } from "child_process";
import get from "lodash/get";
import trim from "lodash/trim";
import split from "lodash/split";
import last from "lodash/last";

/**
 * Get IAM user information: id and username
 */
export const getIamUser = () => {
  logInfo("Getting user id...");

  const result = execSync(`aws sts get-caller-identity`, { encoding: "utf-8" });
  const json = JSON.parse(result);

  const userId = get(json, "UserId");
  logInfo("User id: ", userId);

  const arn = trim(get(json, "Arn"));
  const username = trim(last(split(arn, "/")));
  logInfo("Username: ", username);

  return {
    userId,
    username,
  };
};
