#!/bin/sh

export ENV=staging

git checkout dev
git pull

npm i -g yarn
npm i -g ts-node
yarn install
yarn dev