import express from "express";
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

log.status("Starting Application");

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

AppDataSource.initialize().then(() => {
	const routesPath = path.resolve(__dirname, "routes");
	const routes: Array<string> = fs.readdirSync(routesPath)
		.filter((e) => !(e.includes(".js") || e.includes(".ts")));

	for (const router of routes) {
		const req_router = require(`./routes/${router}/index`);
		app.use(`/${router}`, req_router);
	}
	// 404
	app.use("*", notfound);

	app.listen(env.APPLICATION_PORT, () => {
		log.status(
			`Application Start at PORT ${env.APPLICATION_PORT}\tENV=${env.ENV}\tURL=http://127.0.0.1:${env.APPLICATION_PORT}`
		);
	});
});
