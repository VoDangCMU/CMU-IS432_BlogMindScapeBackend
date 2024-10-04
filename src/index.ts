import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { AppDataSource } from "./database/DataSource";
import { isAuth } from "./middlewares/isAuth";
import env from "./env";
import notfound from "./routes/[404]";

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.get("/hello", (req, res) => {
  res.json({ message: "world" });
}); // This endpoint only for health checking

AppDataSource.initialize().then(() => {
  // Public router before this middleware
  const publicRouterPath = path.resolve(__dirname, "routes", "public");
  const publicRouter: Array<string> = fs.readdirSync(publicRouterPath);

  for (const router of publicRouter) {
    const req_router = require(`./routes/public/${router}/index`);

    app.use(`/${router}`, req_router);
  }

  app.use(isAuth);

  // Authed router
  const authedRouterPath = path.resolve(__dirname, "routes", "authed");
  const authedRouter: Array<string> = fs.readdirSync(authedRouterPath);

  for (const router of authedRouter) {
    const req_router = require(`./routes/authed/${router}/index`);
    app.use(`/${router}`, req_router);
  }

  // 404
  app.use("*", notfound);

  app.listen(env.APPLICATION_PORT, () => {
    console.log(
      `Application Start at PORT ${env.APPLICATION_PORT}\nENV=${env.ENV}`
    );
  });
});
