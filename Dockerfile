FROM node:20-alpine

WORKDIR /app

# Copy package files và cài dependencies bằng Yarn
COPY package.json yarn.lock ./
RUN yarn install

# Copy source code
COPY . .

# Expose port Vite dev server
EXPOSE 5173

# Start Vite dev server, mở cho tất cả IP (Docker cần)
CMD ["yarn", "dev", "--host", "0.0.0.0"]

### docker build -t lehaitien/gym-crm-fe:v1 .


