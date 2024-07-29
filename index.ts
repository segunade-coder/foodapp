import dotenv from "dotenv";
dotenv.config();
import express from "express";
import "express-async-errors";
import http from "http";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import { corsConfig, sessionMiddleware } from "./configs/configOptions";
import path from "path";
import router from "./routes";
import { model } from "./model";
import { errorHandler } from "./middlewares/errorhandler";
import logger from "./utils/logger";
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

process.on("uncaughtException", (error) => {
  logger.error(error.message, { name: error.name, stack: error.stack });
  process.exit(1);
});

// express middlewarrrrrrrr
model();
app.set("trust proxy", 1);
app.use(cors(corsConfig));
app.use(express.static(path.resolve(__dirname, "./public")));
app.use("/images", express.static(path.resolve(__dirname, "./images")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(compression());
app.use(sessionMiddleware);
app.use(router);
app.use(errorHandler);
server.listen(PORT, () => logger.info(`Live on ${PORT}`));
