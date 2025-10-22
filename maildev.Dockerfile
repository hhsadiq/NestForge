FROM node:20.19.5-alpine

RUN npm i -g maildev@2.0.5

CMD maildev
