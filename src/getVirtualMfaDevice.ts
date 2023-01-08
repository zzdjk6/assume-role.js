import { logInfo } from "./logInfo";
import { execSync } from "child_process";
import get from "lodash/get";
import isEqual from "lodash/isEqual";

export const getVirtualMfaDevice = (userId: string) => {
  logInfo("Getting virtual MFA device...");

  const output = execSync(`aws iam list-virtual-mfa-devices --no-paginate`, { encoding: "utf-8" });
  const json = JSON.parse(output);
  const arr = get(json, "VirtualMFADevices");
  if (!Array.isArray(arr)) {
    throw new Error("Fail to fetch virtual MFA devices");
  }

  const data = arr.find((item) => {
    const itemUserId = get(item, "User.UserId");
    return isEqual(itemUserId, userId);
  });

  if (!data) {
    throw new Error(`No virtual MFA device found for user ${userId}`);
  }

  const mfaArn = get(data, "SerialNumber");
  logInfo("Virtual MFA device found: ", mfaArn);
  return mfaArn;
};