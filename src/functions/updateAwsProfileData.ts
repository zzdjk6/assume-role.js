import { execSync } from "child_process";
import { logInfo } from "./logInfo";
import { ProfileData } from "../model/ProfileData";

/**
 * Update saved AWS profile data
 *
 * @param profileName
 * @param profileData
 */
export const updateAwsProfileData = (profileName: string, profileData: ProfileData) => {
  execSync(`aws configure set mfa_serial ${profileData.mfa_serial} --profile ${profileName}`, { encoding: "utf-8" });
  execSync(`aws configure set role_arn ${profileData.role_arn} --profile ${profileName}`, { encoding: "utf-8" });
  execSync(`aws configure set role_session_name ${profileData.role_session_name} --profile ${profileName}`, {
    encoding: "utf-8",
  });
  execSync(`aws configure set expiration ${profileData.expiration} --profile ${profileName}`, { encoding: "utf-8" });
  execSync(`aws configure set aws_access_key_id ${profileData.aws_access_key_id} --profile ${profileName}`, {
    encoding: "utf-8",
  });
  execSync(`aws configure set aws_secret_access_key ${profileData.aws_secret_access_key} --profile ${profileName}`, {
    encoding: "utf-8",
  });
  execSync(`aws configure set aws_session_token ${profileData.aws_session_token} --profile ${profileName}`, {
    encoding: "utf-8",
  });

  logInfo("Configs are saved");
};
