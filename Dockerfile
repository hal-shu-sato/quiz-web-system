FROM node:lts-alpine

WORKDIR /usr/src/app

ENV HUSKY=0
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY client/package.json ./client/
COPY server/package.json ./server/

RUN pnpm install --frozen-lockfile

COPY . .

WORKDIR /usr/src/app/server

CMD ["sh", "-c", "pnpm run db:deploy && pnpm run build && pnpm run start"]
