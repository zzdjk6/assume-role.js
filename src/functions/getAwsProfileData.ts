import { execSync } from "child_process";
import trim from "lodash/trim";

/**
 * Retrieve saved AWS profile data
 *
 * @param profileName
 */
export const getAwsProfileData = (profileName: string) => {
  const mfa_serial = trim(executeCommand(`aws configure get mfa_serial --profile ${profileName}`));
  const role_arn = trim(executeCommand(`aws configure get role_arn --profile ${profileName}`));
  const role_session_name = trim(executeCommand(`aws configure get role_session_name --profile ${profileName}`));
  const expiration = trim(executeCommand(`aws configure get expiration --profile ${profileName}`));
  const aws_access_key_id = trim(executeCommand(`aws configure get aws_access_key_id --profile ${profileName}`));
  const aws_secret_access_key = trim(
    executeCommand(`aws configure get aws_secret_access_key --profile ${profileName}`)
  );
  const aws_session_token = trim(executeCommand(`aws configure get aws_session_token --profile ${profileName}`));

  return {
    mfa_serial,
    role_arn,
    role_session_name,
    expiration,
    aws_access_key_id,
    aws_secret_access_key,
    aws_session_token,
  };
};

/**
 * Execute command and ignore stderr
 *
 * @param command
 */
const executeCommand = (command: string) => {
  try {
    return execSync(command, { encoding: "utf-8", stdio: ["pipe", "pipe", "ignore"] });
  } catch (e) {
    return "";
  }
};
