FROM node:12.14.1

RUN apt-get update -y
RUN apt-get install zip -y

RUN curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
RUN unzip awscli-bundle.zip
RUN ./awscli-bundle/install -i /usr/local/aws -b /usr/local/bin/aws

COPY package*.json /app/
COPY node_modules /app/node_modules
COPY build /app
COPY scripts /app/scripts
COPY lambda-retry-provider /app/lambda-retry-provider

WORKDIR /app

ENV SERVER_PORT=3001
EXPOSE 3001

CMD npm run start:docker