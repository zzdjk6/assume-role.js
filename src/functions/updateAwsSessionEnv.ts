type Args = {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
};

/**
 * Update system environment variables for AWS CLI
 *
 * @param args
 */
export const updateAwsSessionEnv = (args: Args) => {
  const { accessKeyId, secretAccessKey, sessionToken } = args;

  process.env.AWS_ACCESS_KEY_ID = accessKeyId;
  process.env.AWS_SECRET_ACCESS_KEY = secretAccessKey;
  process.env.AWS_SESSION_TOKEN = sessionToken;
};
