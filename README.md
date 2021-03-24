# Data Collector API

## Summary
An Express/Node/TypeScript API that exposes a POST route. This route takes a JSON payload that specifies the `provider` of which to retrieve the data for and a `callbackUrl` to `POST` the data back to.

## Prerequisites
- Node
- TypeScript
- Docker (Docker Compose)
- [ngrok](https://ngrok.com/download) (optional)

## Setup Instructions

**IMPORTANT NOTE**: If the `callbackUrl` provided in the request is not publicly accessible and running on your local machine i.e. `localhost`, you will need to use `ngrok` (link above) to tunnel your localhost over the publicly accessible internet. This is due to the application not being able to call local machine URLs that are not inside the application stack. If your `callbackUrl` is publicly accessible, you do not need to worry about this.

**MAKE SURE** this application is cloned into the same directory that contains the [Provider Data Mock Service](https://bitbucket.org/wonderbill/datahog). For example:
```
Applications
└───Provider Data Mock Service (datahog)
└───Data Collector API
```

This will allow the `docker-compose.yml` to bundle the mock service into its own container in the overall application.

### Data Collector API
1) Run `npm i` to install the dependencies.
2) Run `npm build` to build the TypeScript application.

### Provider Data Mock Service
1) Run `npm i` to install the dependencies.
2) Copy the following Dockerfile into the root of the project:
```
# Dockerfile

FROM node:12.14.1

COPY node_modules /app/node_modules
COPY src /app

WORKDIR /app

EXPOSE 3000

CMD node server.js
```

## Starting Application / Details
In the root of this application, run `docker-compose up --build`. This will start up the mock service and this API into their own containers. It will start up a [localstack](https://github.com/localstack/localstack) container which contains all the necessary AWS resources to run this application.

`localstack` will start up the SQS, Lambda and IAM services. Once they are all started, the Dockerfile will run various AWS CLI commands to perform the following tasks:
- Creating an SQS queue
- Create a Lambda function
- Creating an IAM role for invoking the Lambda function
- Creates a link (trigger) between the SQS and Lambda function

The application will be started on port 3001 (http://localhost:3001/api).

## Example Request
```
curl -X POST http://localhost:3001/api/providers -H 'Content-Type: application/json' -d '{ "provider": "internet", "callbackUrl": "http://example.com/callback" }'
```

## Potential Future Improvements
- GraphQL could be added in for handling much more data.
- Redis could be introduced to store/cache the data once it's initially retrieved and recover as and when needed. This will prevent flinging the data around.
- Use alpine versions of the Node Docker image to decrease build times.
- Introduce a script that waits/checks for `localstack` to be ready before creating the AWS resources. This is better than just sleeping for a period of time.
- Allow for multiple providers to be specified in the request i.e. run a `Promise.all` including the requests for each provider,
