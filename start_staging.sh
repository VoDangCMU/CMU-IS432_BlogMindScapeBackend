#!/bin/sh

export ENV=staging
npm i -g yarn
npm i -g ts-node
yarn install
yarn build
yarn start