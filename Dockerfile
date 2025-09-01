FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY server/package.json ./server/

RUN yarn install --frozen-lockfile

COPY . .

WORKDIR /usr/src/app/server

CMD ["sh", "-c", "yarn run db:deploy && yarn run build && yarn run start"]
