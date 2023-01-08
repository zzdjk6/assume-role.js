import { execSync as _execSync } from "child_process";
import trim from "lodash/trim";

const execSync = (command: string) => {
  try {
    return _execSync(command, { encoding: "utf-8", stdio: ["pipe", "pipe", "ignore"] });
  } catch (e) {
    return "";
  }
};

export const getSavedInfoFromConfig = (profile: string) => {
  const mfa_serial = trim(execSync(`aws configure get mfa_serial --profile ${profile}`));
  const role_arn = trim(execSync(`aws configure get role_arn --profile ${profile}`));
  const role_session_name = trim(execSync(`aws configure get role_session_name --profile ${profile}`));
  const expiration = trim(execSync(`aws configure get expiration --profile ${profile}`));
  const aws_access_key_id = trim(execSync(`aws configure get aws_access_key_id --profile ${profile}`));
  const aws_secret_access_key = trim(execSync(`aws configure get aws_secret_access_key --profile ${profile}`));
  const aws_session_token = trim(execSync(`aws configure get aws_session_token --profile ${profile}`));

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
