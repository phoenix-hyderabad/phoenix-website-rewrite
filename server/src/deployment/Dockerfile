FROM node:20-alpine

WORKDIR /app

COPY package*.json .

RUN npm install bun -g

RUN bun install

COPY . .

EXPOSE 9000

CMD ["bun", "watch"]
