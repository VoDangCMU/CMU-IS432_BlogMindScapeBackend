import { AppDataSource } from "../database/DataSource";

async function runner() {
  await AppDataSource.initialize();
}

runner();