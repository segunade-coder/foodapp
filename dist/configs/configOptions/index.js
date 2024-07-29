"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.sessionMiddleware = exports.corsConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "../../.env" });
const express_session_1 = __importDefault(require("express-session"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const MysqlStore = require("express-mysql-session")(express_session_1.default);
exports.corsConfig = {
    origin: [process.env.CLIENT_URL, "http://127.0.0.1:5500"],
    credentials: true,
};
const storeOptions = {
    host: process.env.M_HOST,
    user: process.env.M_USERNAME,
    password: process.env.M_PASSWORD || "",
    database: process.env.M_DATABASE,
    port: parseInt(process.env.MYSQL_PORT),
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
exports.sessionMiddleware = (0, express_session_1.default)({
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
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const image_path = path_1.default.resolve(__dirname, "../../images");
        cb(null, image_path);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now();
        cb(null, `${uniqueSuffix}_${file.originalname.toLowerCase().replace(/ /g, "_")}`);
    },
});
exports.upload = (0, multer_1.default)({ storage });
