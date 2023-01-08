import { execSync } from "child_process";
import { logInfo } from "./logInfo";

export const saveInfoToConfig = (
  profile: string,
  info: {
    mfa_serial: string;
    role_arn: string;
    role_session_name: string;
    expiration: string;
    aws_access_key_id: string;
    aws_secret_access_key: string;
    aws_session_token: string;
  }
) => {
  execSync(`aws configure set mfa_serial ${info.mfa_serial} --profile ${profile}`, { encoding: "utf-8" });
  execSync(`aws configure set role_arn ${info.role_arn} --profile ${profile}`, { encoding: "utf-8" });
  execSync(`aws configure set role_session_name ${info.role_session_name} --profile ${profile}`, { encoding: "utf-8" });
  execSync(`aws configure set expiration ${info.expiration} --profile ${profile}`, { encoding: "utf-8" });
  execSync(`aws configure set aws_access_key_id ${info.aws_access_key_id} --profile ${profile}`, { encoding: "utf-8" });
  execSync(`aws configure set aws_secret_access_key ${info.aws_secret_access_key} --profile ${profile}`, {
    encoding: "utf-8",
  });
  execSync(`aws configure set aws_session_token ${info.aws_session_token} --profile ${profile}`, { encoding: "utf-8" });

  logInfo("Configs are saved");
};
