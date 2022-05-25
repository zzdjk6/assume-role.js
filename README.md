# assume-role.js

Assume role cli tool implemented in node.js

## Run

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