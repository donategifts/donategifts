FROM node:18

RUN mkdir -p /app

WORKDIR /app

COPY package*.json ./

COPY ./ .

RUN npm install --ignore-scripts

RUN npm run build

RUN npm ci --omit=dev --ignore-scripts

RUN npm rebuild

EXPOSE 8080

CMD [ "npm", "start" ]
