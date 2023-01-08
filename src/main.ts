import isEmpty from "lodash/isEmpty";
import { execSync } from "child_process";
import { logError } from "./logError";
import { checkAwsCliVersion } from "./checkAwsCliVersion";
import { parseCliArgs } from "./parseCliArgs";
import { getVirtualMfaDevice } from "./getVirtualMfaDevice";
import { createSecureSession } from "./createSecureSession";
import { printSessionInfo } from "./printSessionInfo";
import { assumeRole } from "./assumeRole";
import { getProfile } from "./getProfile";
import { getSavedInfoFromConfig } from "./getSavedInfoFromConfig";
import { isExpired } from "./isExpired";
import { saveInfoToConfig } from "./saveInfoToConfig";
import { logInfo } from "./logInfo";

const main = () => {
  const { roleArn, command } = parseCliArgs();

  checkAwsCliVersion();
  const profile = getProfile(roleArn);
  const info = getSavedInfoFromConfig(profile);

  if (isExpired(info.expiration)) {
    logInfo("Session expired");
    const mfaArn = info.mfa_serial || getVirtualMfaDevice();
    createSecureSession(mfaArn);
    const { expiration, accessKeyId, secretAccessKey, sessionToken } = assumeRole(roleArn);
    saveInfoToConfig(profile, {
      expiration,
      aws_access_key_id: accessKeyId,
      aws_secret_access_key: secretAccessKey,
      aws_session_token: sessionToken,
      role_arn: roleArn,
      mfa_serial: mfaArn,
      role_session_name: profile,
    });

    process.env.AWS_ACCESS_KEY_ID = accessKeyId;
    process.env.AWS_SECRET_ACCESS_KEY = secretAccessKey;
    process.env.AWS_SESSION_TOKEN = sessionToken;
  } else {
    process.env.AWS_ACCESS_KEY_ID = info.aws_access_key_id;
    process.env.AWS_SECRET_ACCESS_KEY = info.aws_secret_access_key;
    process.env.AWS_SESSION_TOKEN = info.aws_session_token;
  }

  if (!isEmpty(command)) {
    execSync(command, { stdio: "inherit" });
  } else {
    printSessionInfo();
  }
};

main();
