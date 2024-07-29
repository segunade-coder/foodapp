import { CorsOptions } from "cors";
import dotenv from "dotenv";
import { Request } from "express";
dotenv.config({ path: "../../.env" });
import session from "express-session";
import multer from "multer";
import path from "path";
const MysqlStore = require("express-mysql-session")(session);
export const corsConfig: CorsOptions = {
  origin: [process.env.CLIENT_URL as string, "http://127.0.0.1:5500"],
  credentials: true,
};

const storeOptions = {
  host: process.env.M_HOST as string,
  user: process.env.M_USERNAME as string,
  password: (process.env.M_PASSWORD as string) || "",
  database: process.env.M_DATABASE as string,
  port: parseInt(process.env.MYSQL_PORT as string),
  clearExpired: true,
  checkExpirationInterval: 50000,
  expiration: 1000 * 60 * 60 * 24,
  createDatabaseTable: true,
  connectionLimit: 1,
  endconnectionOnClose: true,
  charset: "utf8mb4_bin",
  schema: {
    tableName: "sessions",
    columnNames: {
      session_id: "session_id",
      expires: "expires",
      data: "data",
    },
  },
};

const sessionStore = new MysqlStore(storeOptions);

export const sessionMiddleware = session({
  secret: "something worth hiding48798",
  saveUninitialized: false,
  resave: false,
  store: sessionStore,
  name: "bonjour.meals",
  cookie: {
    secure: process.env.NODE_ENV === "production" ? true : "auto",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
});

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const image_path = path.resolve(__dirname, "../../images");
    cb(null, image_path);
  },
  filename: (req: Request, file, cb) => {
    const uniqueSuffix = Date.now();
    cb(
      null,
      `${uniqueSuffix}_${file.originalname.toLowerCase().replace(/ /g, "_")}`
    );
  },
});
export const upload = multer({ storage });
