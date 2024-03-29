FROM node:16.15.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000 5757

CMD ["npm", "run", "dev"]

