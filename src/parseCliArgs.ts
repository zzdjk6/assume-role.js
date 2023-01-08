import get from "lodash/get";
import join from "lodash/join";
import toString from "lodash/toString";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";

export const parseCliArgs = () => {
  const argv = yargs(hideBin(process.argv))
    .version("1.0.0")
    .option("role", {
      describe: "The role arn, e.g., arn:aws:iam::123456789:role/developer",
      type: "string",
    })
    .demandOption(["role"])
    .help().argv;

  const roleArn = toString(get(argv, "role"));
  const command = join(get(argv, "_"), " ");

  return {
    command,
    roleArn,
  };
};
