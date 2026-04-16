FROM node:24-alpine AS dev

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY src/ ./src/

FROM dev AS build
RUN pnpm build

FROM node:24-alpine AS prod

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

CMD ["node", "dist/index.js"]
