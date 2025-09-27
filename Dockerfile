FROM node:20-alpine3.17

WORKDIR /app

COPY package*.json .

RUN npm i

COPY . .

CMD ["sh", "-c", "npx knex migrate:latest --knexfile ./knexfile.js. && npm run start:dev"]
