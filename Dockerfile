FROM node:12.14.1

COPY package*.json /app/
COPY node_modules /app/node_modules
COPY build /app

WORKDIR /app

EXPOSE 3000

CMD npm run start:docker