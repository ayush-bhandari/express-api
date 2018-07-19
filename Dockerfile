FROM node:8.1.4-alpine
MAINTAINER Ayush Bhandari
RUN npm install pm2 -g
RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
EXPOSE 3000
CMD ["pm2-docker","start", "process.json"]