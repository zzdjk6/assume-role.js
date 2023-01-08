import { logInfo } from "./logInfo";
import { execSync } from "child_process";
import toInteger from "lodash/toInteger";

export const checkAwsCliVersion = () => {
  logInfo("Checking AWS CLI version...");

  const str = execSync(`aws --version`, { encoding: "utf-8" });
  const matches = str.match(/aws-cli\/(?<version>\d)/i);
  const version = toInteger(matches?.groups?.version);
  if (version !== 2) {
    throw new Error(`AWS CLI version ${version} is not supported`);
  }

  logInfo("AWS CLI version: ", version);
};
