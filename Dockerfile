FROM node:24-alpine

# bun runs the dev server, pnpm manages dependencies
RUN corepack enable && npm install -g bun@1.4.3

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000 5757

CMD ["pnpm", "run", "dev"]
