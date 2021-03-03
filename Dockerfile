FROM node:12.14.1

COPY package*.json /app/
COPY node_modules /app/node_modules
COPY build /app

WORKDIR /app

ENV SERVER_PORT=3001
EXPOSE 3001

CMD npm run start:docker