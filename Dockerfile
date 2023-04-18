FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
COPY client/package*.json client/
COPY server/package*.json server/

RUN npm install --omit=dev

RUN npm run install

COPY client/ client/
COPY server/ server/

RUN npm run build:linux

USER node

CMD ["npm", "run", "start"]

EXPOSE 8000