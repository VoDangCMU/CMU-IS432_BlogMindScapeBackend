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

### TL;DR
Modify or create new entity in [models](./src/database/models) folder. Then run `yarn migration:generate <migrationName>` to generate new migration.  
After that, you can exec `yarn migration:run` to apply changes to database.  
Enjoy!  

### Create new migration

```bash
  yarn migration:create <MigrationName>
```

For example:
```bash
  yarn migration:create addCreatedAtToComment
```

### Generate new migration from entities changes
You can use this command to quickly create migration from entities change in [models](./src/database/models) folder:
```bash
  yarn migration:generate <migrationName>
```

This command will create new migration in [migrations](./src/database/migrations) folder.  

## Context

### UserID and SessionID
`userID` and `sessionID` available on every router behind [isAuth](src/middlewares/isAuth.ts) middleware. You can easily access to these 2 value at request headers.
For example:
```ts
    const userID = req.headers.userID!;
    const sessionID = req.headers.sessionID!;
```

It's safe to use force operator (!).  

### Document
You can find OpenAPI v3 Specs [here](https://app.box.com/s/79ux7nm23iontdz9gh6xupgdpvm74xya).  
Import this file to Postman, Apidog,... to explore api document.

### Socket.io
```js
import socketio from 'socket.io-client';

const io = socketio('<URL>', {
	index: {
		token: "<Access Token>"
	}
});
```

You can subscribe to notification in `notification` channel. eg:
```js
io.on("notification", (data) => {
  console.log(data); // not authorized
});
```

Or simply subscribe to all event:
```js
io.onAny((eventName, data) => {
	console.log(eventName, " - ", data);
});
```
