FROM node:latest

WORKDIR /server

COPY package*.json ./

RUN npm i

COPY . .

WORKDIR /server/src

CMD ["npm","run","dev"]