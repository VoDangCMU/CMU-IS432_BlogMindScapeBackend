FROM node:22.8-slim

RUN mkdir -p /home/node/blog_backend

WORKDIR /home/node/blog_backend
COPY package*.json ./
COPY tsconfig.json ./

COPY . .

ENV ENV production

RUN npm install --force --global yarn
RUN yarn install --check-file
RUN yarn build

EXPOSE 5000

CMD [ "yarn", "start" ]