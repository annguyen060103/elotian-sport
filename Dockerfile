# ---------- STAGE 1: Build ----------
FROM node:20.11.1-slim AS builder

# Cài công cụ cần thiết để build (nếu có native packages)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package config và cài deps
COPY package.json yarn.lock ./
RUN yarn install

# Copy toàn bộ source code
COPY . .

# Build Vite app
RUN yarn build

# ---------- STAGE 2: Serve ----------
FROM node:20.11.1-slim AS runner

WORKDIR /app

# Cài server tĩnh
RUN yarn global add serve

# Copy từ builder
COPY --from=builder /app/dist ./dist

EXPOSE 5173

# Serve app production
CMD ["serve", "-s", "dist", "-l", "5173"]
