# assume-role.js

Assume role cli tool implemented in node.js

## Run

This tool assumes that you have done basic configuration of your AWS account by doing `aws configure` already.

That is, you should have your default AWS CLI profile and credentials set up already before going further.

```shell
node bin/assume-role.js --role="<YOUR_ROLE>" --token="<MFA_TOKEN>" --command="<YOUR COMMAND>"
```

e.g., 

```shell
node bin/assume-role.js --role="arn:aws:iam::123456789:role/developer" --token="123456" --command="aws s3 ls"
```

Note: `--role` and `--token` is optional, if you don't provide them, the CLI will ask for input.

You can also run the development version:

```shell
yarn
yarn run exec --role="<YOUR_ROLE>" --token="<MFA_TOKEN>" --command="<YOUR COMMAND>"
```