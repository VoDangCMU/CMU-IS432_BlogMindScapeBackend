#!/bin/sh

export ENV=production
yarn install
npx tsc -p tsconfig.json

node ./dist/index.js