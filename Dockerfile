FROM node:latest

COPY . /junidev

WORKDIR /junidev

EXPOSE 3000

RUN npm install

CMD ["npm", "start"]
