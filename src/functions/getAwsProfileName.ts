import get from "lodash/get";
import { logInfo } from "./logInfo";

/**
 * Get profile name from role arn
 *
 * example:
 *   role arn: arn:aws:iam::123456:role/developer
 *   profile: 123456-developer
 * @param roleArn
 */
export const getAwsProfileName = (roleArn: string) => {
  const re = /arn:aws:iam::(\d+):role\/(.+)/;
  const matches = re.exec(roleArn);
  const accountId = get(matches, "1");
  const roleName = get(matches, "2");
  const profile = [accountId, roleName].join("-");
  logInfo(`The AWS profile is ${profile}`);

  return profile;
};
