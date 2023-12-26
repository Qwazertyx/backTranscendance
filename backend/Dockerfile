FROM node:lts-alpine

COPY src /home/node/app/src
COPY test /home/node/app/test
COPY nest-cli.json /home/node/app/
COPY data /home/node/app/data
COPY package-lock.json /home/node/app/
COPY package.json /home/node/app/
COPY tsconfig.build.json /home/node/app/
COPY tsconfig.json /home/node/app/

ENV NODE_ENV=${NODE_ENV}

WORKDIR /home/node/app

RUN npm ci
RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start:dev"]