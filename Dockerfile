# BUILD STAGE
FROM node:current-alpine3.19 AS build

WORKDIR /build

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

# After the buil we re-install, optimising for development
RUN npm ci --only=production && npm cache clean --force

# PRODUCTION STAGE
FROM node:current-alpine3.19 AS prod

WORKDIR /server

COPY --from=build /build/dist ./dist
COPY --from=build /build/node_modules ./node_modules

EXPOSE 3456

CMD ["node", "dist/src/main.js"]