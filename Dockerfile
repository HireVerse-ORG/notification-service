FROM node:21-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# develepement
FROM node:21-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 6001

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]

# production
FROM node:21-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 6001

ENV NODE_ENV=production

CMD ["npm", "start"]
