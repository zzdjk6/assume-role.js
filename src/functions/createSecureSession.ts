import { logInfo } from "./logInfo";
import { question } from "readline-sync";
import { execSync } from "child_process";
import get from "lodash/get";

/**
 * Get system environment variables for a secure session to run role assume
 *
 * @param mfaArn
 */
export const createSecureSession = (mfaArn: string) => {
  logInfo("Creating secure session...");

  const tokenCode = question("What is your token code? ");
  const output = execSync(`aws sts get-session-token --serial-number ${mfaArn} --token-code ${tokenCode}`, {
    encoding: "utf-8",
  });
  const json = JSON.parse(output);
  const accessKeyId = get(json, "Credentials.AccessKeyId");
  const secretAccessKey = get(json, "Credentials.SecretAccessKey");
  const sessionToken = get(json, "Credentials.SessionToken");
  const expiration = get(json, "Credentials.Expiration");

  if (!accessKeyId || !secretAccessKey || !sessionToken) {
    throw new Error("Create secure session failed");
  }

  logInfo("Secure session created");

  return {
    accessKeyId,
    secretAccessKey,
    sessionToken,
    expiration,
  };
};
