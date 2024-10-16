FROM node:20-alpine
FROM oven/bun

WORKDIR /app

COPY package*.json .

RUN bun install

COPY . .

EXPOSE 9000

CMD ["bun", "watch"]
