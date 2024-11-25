import {Router} from "express";
import purge from "@routes/db/purgeDB";
import isNotProduction from "@root/middlewares/isNotProduction";

const db = Router();

db.use(isNotProduction)
db.post("/purge", purge);

export default db;
module.exports = db;
