# assume-role.js

Assume role cli tool implemented in node.js.

The goal is to replace https://github.com/uber/assume-role-cli, so the basic features and usages should be the same.

## Requirement

Node.js 16.x

## Run

This tool assumes that you have done basic configuration of your AWS account by doing `aws configure` already.

That is, you should have your default AWS CLI profile and credentials set up already before going further.

### Using development bundle

```shell
# Build
yarn
yarn build
# Link executable so we can run `assume-role-js` from command line directly
npm link
# Run with command (e.g., list s3 buckets)
assume-role-js --role arn:aws:iam::123456789:role/developer aws s3 ls
# Run without commend (i.e., just output the credentials)
assume-role-js --role arn:aws:iam::123456789:role/developer
```

### Using production bundle

```shell
# Install
npm install -g assume-role-js
# Run with command (e.g., list s3 buckets)
assume-role-js --role arn:aws:iam::123456789:role/developer aws s3 ls
# Run without commend (i.e., just output the credentials)
assume-role-js --role arn:aws:iam::123456789:role/developer
```