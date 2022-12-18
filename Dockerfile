FROM node:12.13-alpine As development

WORKDIR /usr/src/tempus-backend

COPY package*.json ./

RUN npm install --only=development

COPY . .

RUN start:migrate:dev

FROM node:12.13-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/tempus-backend

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/tempus-backend/dist ./dist

CMD ["node", "dist/main"]