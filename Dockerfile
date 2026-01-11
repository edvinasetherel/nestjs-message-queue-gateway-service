FROM node:24.12-alpine

RUN corepack enable && corepack prepare pnpm@10.28.0 --activate

WORKDIR app

COPY package.json pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 3000

CMD ["node", "dist/adapters/driving/nestjs-rest-http/entrypoint"]
