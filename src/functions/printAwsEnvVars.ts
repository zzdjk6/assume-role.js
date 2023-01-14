/**
 * Print out the system environment variables that AWS CLI uses to identify session
 */
export const printAwsEnvVars = () => {
  console.log(`AWS_ACCESS_KEY_ID=${process.env.AWS_ACCESS_KEY_ID}`);
  console.log(`AWS_SECRET_ACCESS_KEY=${process.env.AWS_SECRET_ACCESS_KEY}`);
  console.log(`AWS_SESSION_TOKEN=${process.env.AWS_SESSION_TOKEN}`);
};
