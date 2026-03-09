# Nuxt Studio SSR Deployment
# Build: docker build -t portfolio .
# Run:   docker run -p 3000:3000 --env-file .env portfolio

FROM node:22-alpine AS base

# Install pnpm
RUN npm install -g pnpm@10

WORKDIR /app

# Dependencies layer
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build layer
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# Production layer
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy built output
COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
