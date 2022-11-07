import mongoose from "mongoose";
import config from "config";
import log from "../utils/logger";

function connect() {
  const db = config.get("dbUrl") as string;
  log.info(`Connecting to ${db}`);
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as object;

  return mongoose
    .connect(db, options)
    .then(() => {
      log.info("Database connected.");
    })
    .catch((error) => {
      log.info("Database connection failed.");
      log.info(error);
      process.exit(1);
    });
}

export default connect;
