FROM node:22.8-slim

RUN mkdir -p /home/node/blog_backend

WORKDIR /home/node/blog_backend
COPY package*.json ./
COPY tsconfig.json ./

COPY . .

RUN npm install --force --global yarn
RUN npm install --force --global ts-node
RUN npm install --force --global typescipt
RUN yarn install --check-file
RUN yarn build

EXPOSE 5000

CMD [ "yarn", "run", "start_prod" ]