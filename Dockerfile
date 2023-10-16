FROM node:14 AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000
CMD [ "npm", "run", "start:migrate:dev" ]