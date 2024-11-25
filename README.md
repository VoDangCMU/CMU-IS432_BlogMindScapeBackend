# Instruction

## Quick start

- Create database based on your environment (eg. development, production)
- Create `.env` file. For file structure please follow [this section](#env-structure)
- Install dependencies: `yarn install`
- ` Run `yarn dev`

## .env structure

```js
APPLICATION_PORT =
ENV =
SALT_ROUND =
TOKEN_SECRET =

DB_HOST =
DB_PORT =
DB_USERNAME =
DB_PASSWORD =
DB_DATABASE =
```

## Run using pm2

```bash
pm2 start ./start.sh --name blog_backend
```

## Build to docker image

```bash
docker build -t blog_backend .
```

This image expose at port 5000.  

## Migration