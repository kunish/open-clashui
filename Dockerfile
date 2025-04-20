FROM docker.io/node:slim AS builder

WORKDIR /app

COPY . .

RUN corepack enable
RUN corepack prepare pnpm@latest --activate
RUN pnpm install
RUN pnpm build

FROM docker.io/node:slim

EXPOSE 3000
COPY --from=builder /app/.output/. .

CMD ["node", "server/index.mjs"]