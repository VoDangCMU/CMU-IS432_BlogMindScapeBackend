import {Router} from "express";
import purge from "@routes/test_only/db/purgeDB";

const db = Router();

db.post("/purge", purge);

export default db;
module.exports = db;
