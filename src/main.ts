import isEmpty from "lodash/isEmpty";
import { execSync } from "child_process";
import { logError } from "./logError";
import { checkAwsCliVersion } from "./checkAwsCliVersion";
import { parseCliArgs } from "./parseCliArgs";
import { getUserId } from "./getUserId";
import { getVirtualMfaDevice } from "./getVirtualMfaDevice";
import { createSecureSession } from "./createSecureSession";
import { printSessionInfo } from "./printSessionInfo";
import { assumeRole } from "./assumeRole";

const main = async () => {
  const { roleArn, command } = parseCliArgs();

  await checkAwsCliVersion();
  const userId = getUserId();
  const mfaArn = getVirtualMfaDevice(userId);
  await createSecureSession(mfaArn);
  await assumeRole(roleArn);

  if (!isEmpty(command)) {
    execSync(command, { stdio: "inherit" });
  } else {
    printSessionInfo();
  }
};

main().catch(logError);
