import get from "lodash/get";
import { logInfo } from "./logInfo";
import { execSync } from "child_process";

export const assumeRole = (roleArn: string) => {
  const timestamp = new Date().getTime();
  const output = execSync(`aws sts assume-role --role-arn ${roleArn} --role-session-name assume-role-js-${timestamp}`, {
    encoding: "utf-8",
  });
  const json = JSON.parse(output);

  const accessKeyId = get(json, "Credentials.AccessKeyId");
  const secretAccessKey = get(json, "Credentials.SecretAccessKey");
  const sessionToken = get(json, "Credentials.SessionToken");
  const expiration = get(json, "Credentials.Expiration");

  if (!accessKeyId || !secretAccessKey || !sessionToken) {
    throw new Error("Assume role failed");
  }

  logInfo("Role assumed, expiration: ", expiration);

  return {
    accessKeyId,
    secretAccessKey,
    sessionToken,
    expiration,
  };
};
