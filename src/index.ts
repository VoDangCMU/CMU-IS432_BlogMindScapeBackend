import express, {Router} from "express";
import {createServer} from "http";
import path from "path";
import fs from "fs";
import cors, {CorsOptions} from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import {AppDataSource} from "./database/DataSource";
import env from "./env";
import notfound from "./routes/[404]";
import log from "@services/logger";
import morgan from "morgan";
import {loadSocket} from "@root/socket/socket";
import {glob} from "glob";

log.status("Starting Application");
log.status("Configuring routes");
log.status("Establishing database connection");

AppDataSource.initialize()
	.then(() => log.status("Database connection established"))
	.catch((err) => {
		log.error(err);
	})

const app = express();

const whitelist = [
	"localhost",
	"*",
	"khoav4.com"
]

const corsOption: CorsOptions = {
	credentials: true,
	optionsSuccessStatus: 200,
	origin: function (origin, callback) {
		if (whitelist.some((e) => origin?.includes(e)) || !origin) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	}
}

if (env.ENV !== "production") {
	app.use(morgan("dev"));
}

app.use(cookieParser());
app.use(cors(corsOption));
app.use(bodyParser.json());
app.get("/hello", (req, res) => {
	res.json({message: "world"});
}); // This endpoint only for health checking

const routes = glob.sync("./src/routes/**/*.{js,ts}");

for (const routePath of routes) {
	log.status("Checking file " + routePath);
	const routerName = routePath.split(/[\\/]/g).pop()!.replace(/\.(ts|js)\b/g, '');
	const router: Router = require(routePath);
	log.status("Checking if this file is a router...")
	if (router.stack) {
		log.status("Registering endpoint /" + routerName);
		app.use(`/${routerName}`, router);
		log.success("Registered endpoint /" + routerName);
	} else {
		log.warn("Not a express router. Skipping...")
	}
}

// 404
app.use("*", notfound);

let httpServer = createServer(app);
httpServer = loadSocket(httpServer);
httpServer.listen(env.APPLICATION_PORT, () => {
	log.status(
		`Application Start at PORT ${env.APPLICATION_PORT}\tENV=${env.ENV}\tURL=http://127.0.0.1:${env.APPLICATION_PORT}`
	);
})
