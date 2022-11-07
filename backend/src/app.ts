import express from "express";
import config from "config";
import connect from "./db/connect";
import routes from "../routes";
import cors from "cors";
import deserializeUser from "./middleware/deserializeUser";
import log from "./utils/logger";

const port = config.get("port") as number;
const host = config.get("host") as string;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(deserializeUser);

app.listen(port, host, () => {
  log.info(`Server is running on http://${host}:${port}`);

  connect();
  routes(app);
});
