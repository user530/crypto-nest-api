FROM node:21.2.0-alpine

WORKDIR /crypto-server

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3456

CMD [ "npm", "run", "start" ]