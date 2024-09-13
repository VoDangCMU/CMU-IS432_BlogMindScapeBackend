import express from "express";
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { AppDataSource } from "./database/DataSource";
import { isAuth } from "./middlewares/isAuth";
import auth from "./routes/auth";

const routerPath = path.resolve(__dirname, "routes");

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.get("/hello", (req, res) => {
  res.json({ message: "world" });
}); // This endpoint only for health checking

app.use("/auth", auth);

// Public router before this middleware
app.use(isAuth);

AppDataSource.initialize()
.then(() => {
  const routes: Array<string> = fs.readdirSync(routerPath);
  
  for (const router of routes) {
    if (router != "auth") {
      const req_router = require(`./routes/${router}/index`)
    
      app.use(`/${router}`, req_router);
    }
  }
  
  app.listen(3000, () => {
    console.log("Running");
  })
})
