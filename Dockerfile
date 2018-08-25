FROM node:9-jessie

RUN mkdir /app
RUN apt-get install git-core -y

COPY . /app/

CMD node /app/index.js
