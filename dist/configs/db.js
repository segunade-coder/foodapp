"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("../utils/logger"));
dotenv_1.default.config({ path: "../.env" });
const db_cred = {
    host: process.env.M_HOST,
    user: process.env.M_USERNAME,
    password: process.env.M_PASSWORD || "",
    database: process.env.M_DATABASE,
    port: parseInt(process.env.MYSQL_PORT),
    multipleStatements: true,
};
// create a database connection with the credentials above
const connection = mysql_1.default.createConnection(db_cred);
//connect to the apache server
connection.connect((err) => {
    if (err) {
        logger_1.default.error("Failed to connect to the database");
        process.exit(1);
        // throw err;
    }
});
// export the connection
exports.default = connection;
