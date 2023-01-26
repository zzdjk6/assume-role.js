import isEmpty from "lodash/isEmpty";
import { execSync } from "child_process";
import { checkAwsCliVersion } from "./functions/checkAwsCliVersion";
import { parseCliArgs } from "./functions/parseCliArgs";
import { getVirtualMfaArn } from "./functions/getVirtualMfaArn";
import { createSecureSession } from "./functions/createSecureSession";
import { printAwsEnvVars } from "./functions/printAwsEnvVars";
import { assumeRole } from "./functions/assumeRole";
import { getAwsProfileName } from "./functions/getAwsProfileName";
import { getAwsProfileData } from "./functions/getAwsProfileData";
import { isRoleSessionAlive } from "./functions/isRoleSessionAlive";
import { updateAwsProfileData } from "./functions/updateAwsProfileData";
import { logInfo } from "./functions/logInfo";
import { getIamUser } from "./functions/getIamUser";
import { updateAwsSessionEnv } from "./functions/updateAwsSessionEnv";

const main = () => {
  const { roleArn, command, forceRefresh } = parseCliArgs();

  checkAwsCliVersion();

  const profileName = getAwsProfileName(roleArn);

  const profileData = getAwsProfileData(profileName);

  if (!forceRefresh && isRoleSessionAlive(profileData.expiration)) {
    logInfo("Session still alive");

    updateAwsSessionEnv({
      accessKeyId: profileData.aws_access_key_id,
      secretAccessKey: profileData.aws_secret_access_key,
      sessionToken: profileData.aws_session_token,
    });
  } else {
    logInfo("Session not exist or expired");

    const { userId, username } = getIamUser();

    const mfaArn = getVirtualMfaArn(userId);

    const secureSessionEnv = createSecureSession(mfaArn);
    updateAwsSessionEnv(secureSessionEnv);

    const roleSessionEnv = assumeRole({ roleArn, sessionName: username });
    updateAwsSessionEnv(roleSessionEnv);

    updateAwsProfileData(profileName, {
      expiration: roleSessionEnv.expiration,
      aws_access_key_id: roleSessionEnv.accessKeyId,
      aws_secret_access_key: roleSessionEnv.secretAccessKey,
      aws_session_token: roleSessionEnv.sessionToken,
      role_arn: roleArn,
      mfa_serial: mfaArn,
      role_session_name: username,
    });
  }

  if (!isEmpty(command)) {
    logInfo(`Executing command:`, command);
    execSync(command, { stdio: "inherit" });
  } else {
    printAwsEnvVars();
  }
};

main();
