FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

CMD ["sh", "-c", "yarn run db:deploy && yarn run build && yarn run start"]
