#!/usr/bin/env bash

set -x

sleep 20s

export AWS_ACCESS_KEY_ID=AKIAEXAMPLE123
export AWS_SECRET_ACCESS_KEY=AWSSECRETACCESSEY123
export AWS_DEFAULT_REGION=eu-west-1

cd lambda-retry-provider/
npm i
zip function.zip index.js
zip -ur function.zip node_modules/
cd ..

aws --endpoint-url http://localstack:4566 sqs create-queue --queue-name retry-queue --region eu-west-1

aws --endpoint-url http://localstack:4566 iam create-role --role-name lambda-role --assume-role-policy-document file://lambda-retry-provider/role.json

aws --endpoint-url http://localstack:4566 lambda create-function --function-name retry-provider --zip-file fileb://lambda-retry-provider/function.zip --runtime nodejs12.x --role arn:aws:iam::000000000000:role/lambda-role --handler index.handler  --region eu-west-1

aws --endpoint-url http://localstack:4566 lambda create-event-source-mapping --function-name arn:aws:lambda:eu-west-1:000000000000:function:retry-provider --event-source-arn arn:aws:sqs:eu-west-1:000000000000:retry-queue --region eu-west-1