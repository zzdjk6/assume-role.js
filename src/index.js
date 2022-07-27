import "zx/globals";
import toInteger from "lodash/toInteger";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import { execSync } from "child_process";

$.verbose = false;

const main = async () => {
  const roleArn = argv["role"];
  const command = argv["command"];
  const token = argv["token"];

  await checkAwsCliVersion();
  const userId = await getUserId();
  const mfaArn = await getVirtualMfaDevice(userId);
  await createSecureSession(mfaArn, token);
  await assumeRole(roleArn);

  if (!isEmpty(command)) {
    execSync(command, { stdio: "inherit" });
  } else {
    printSessionInfo();
  }
};

const printSessionInfo = () => {
  console.log(`AWS_ACCESS_KEY_ID=${process.env.AWS_ACCESS_KEY_ID}`);
  console.log(`AWS_SECRET_ACCESS_KEY=${process.env.AWS_SECRET_ACCESS_KEY}`);
  console.log(`AWS_SESSION_TOKEN=${process.env.AWS_SESSION_TOKEN}`);
};

const assumeRole = async (_roleArn) => {
  const roleArn = _roleArn || (await question("What is your role arn? "));

  const timestamp = new Date().getTime();
  const output = await $`aws sts assume-role --role-arn ${roleArn} --role-session-name assume-role-js-${timestamp}`;
  const json = JSON.parse(output.toString());

  const accessKeyId = get(json, "Credentials.AccessKeyId");
  const secretAccessKey = get(json, "Credentials.SecretAccessKey");
  const sessionToken = get(json, "Credentials.SessionToken");
  const expiration = get(json, "Credentials.Expiration");

  if (!accessKeyId || !secretAccessKey || !sessionToken) {
    throw new Error("Assume role failed");
  }

  process.env.AWS_ACCESS_KEY_ID = accessKeyId;
  process.env.AWS_SECRET_ACCESS_KEY = secretAccessKey;
  process.env.AWS_SESSION_TOKEN = sessionToken;

  log("Role assumed, expiration: ", expiration);
};

const getVirtualMfaDevice = async (userId) => {
  log("Getting virtual MFA device...");

  const output = await $`aws iam list-virtual-mfa-devices --no-paginate`;
  const json = JSON.parse(output.toString());
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
  log("Virtual MFA device found: ", mfaArn);
  return mfaArn;
};

const getUserId = async () => {
  log("Getting user id...");

  const json = JSON.parse((await $`aws sts get-caller-identity`).toString());
  const userId = get(json, "UserId");
  log("User id: ", userId);

  return userId;
};

const createSecureSession = async (mfaArn, token) => {
  log("Creating secure session...");

  const tokenCode = token || (await question("What is your token code? "));
  const output = await $`aws sts get-session-token --serial-number ${mfaArn} --token-code ${tokenCode}`;
  const json = JSON.parse(output.toString());
  const accessKeyId = get(json, "Credentials.AccessKeyId");
  const secretAccessKey = get(json, "Credentials.SecretAccessKey");
  const sessionToken = get(json, "Credentials.SessionToken");
  const expiration = get(json, "Credentials.Expiration");

  if (!accessKeyId || !secretAccessKey || !sessionToken) {
    throw new Error("Create secure session failed");
  }

  process.env.AWS_ACCESS_KEY_ID = accessKeyId;
  process.env.AWS_SECRET_ACCESS_KEY = secretAccessKey;
  process.env.AWS_SESSION_TOKEN = sessionToken;

  log("Secure session created, expiration: ", expiration);
};

const checkAwsCliVersion = async () => {
  log("Checking AWS CLI version...");

  const str = (await $`aws --version`).toString();
  const matches = str.match(/aws-cli\/(?<version>\d)/i);
  const version = toInteger(matches.groups.version);
  if (version !== 2) {
    throw new Error(`AWS CLI version ${version} is not supported`);
  }

  log("AWS CLI version: ", version);
};

const log = (...messages) => {
  const datetime = new Date().toISOString();
  console.log(`[assume-role.js] ${datetime}: `, ...messages);
};

const logError = (...messages) => {
  const datetime = new Date().toISOString();
  console.error(`[assume-role.js] ${datetime}: `, ...messages);
};

main().catch(logError);
