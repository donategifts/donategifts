FROM node:15-alpine

# package json
COPY ./package.json /app/package.json

# build files
COPY ./dist /app/dist

WORKDIR /app

ARG NPM_TOKEN

# install modules
RUN apk add --no-cache --virtual .build-deps alpine-sdk python && \
 echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc && \
    npm install --production && \
    rm -f .npmrc && \
    apk del .build-deps

ARG NODE_ENV
# ARG RELEASE
ARG MONGO_CONNECTION

# ENV RELEASE=$RELEASE
ENV MONGO_CONNECTION=$MONGO_CONNECTION
ENV DB_POOL_SIZE=50
ENV NODE_ENV=$NODE_ENV

EXPOSE 3005

CMD npm run start
