"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
// import { cash, settings, people, tasks } from "../types";
const db_1 = __importDefault(require("../configs/db"));
class dbQueries {
    constructor(connection) {
        this.createTable = (table, ...params) => {
            return new Promise((resolve, reject) => {
                let query_string = ``;
                let columnNames = [];
                let dataType = [];
                let condition = [];
                let dataTypeLength = [];
                let qry = "";
                params.forEach((param) => {
                    columnNames.push(param.columnName);
                    dataType.push(param.dataType);
                    (param === null || param === void 0 ? void 0 : param.dataTypeLength) !== undefined
                        ? dataTypeLength.push("(" + (param === null || param === void 0 ? void 0 : param.dataTypeLength) + ")")
                        : dataTypeLength.push(null);
                    condition.push((param === null || param === void 0 ? void 0 : param.condition) || null);
                });
                for (let i = 0; i < columnNames.length; i++) {
                    qry += `${columnNames[i]} ${dataType[i].toUpperCase()}${dataTypeLength[i] || ""} ${condition[i] || ""} ${i === columnNames.length - 1 ? "" : ","} `;
                }
                // this.connection.query(`SELECT * FROM ${table}`, (err, data ))
                query_string = `CREATE TABLE IF NOT EXISTS ${table} (id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, ${qry}, last_modified TIMESTAMP NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
                this.connection.query(query_string, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(data);
                });
            });
        };
        this.query = (query) => {
            return new Promise((resolve, reject) => {
                this.connection.query(query, (err, data) => {
                    err ? reject(err) : resolve(data);
                });
            });
        };
        this.getOverview = () => {
            return new Promise((resolve, reject) => {
                this.connection.query("SELECT SUM(amount) AS total_revenue FROM orders WHERE status = 'delivered';SELECT COUNT(*) AS total_orders FROM orders;SELECT COUNT(*) AS total_cat FROM categories; SELECT COUNT(*) AS total_products FROM products;", (err, data) => {
                    err ? reject(err) : resolve(data);
                });
            });
        };
        this.getData = (category) => {
            return new Promise((resolve, reject) => {
                this.connection.query(`SELECT * FROM ${category}`, (err, data) => {
                    err ? reject(err) : resolve(data);
                });
            });
        };
        this.queryString = (query, options = []) => {
            return new Promise((resolve, reject) => {
                this.connection.query(query, options, (err, data) => {
                    err ? reject(err.sqlMessage) : resolve(data);
                });
            });
        };
        this.getUser = (username = "", password = "") => {
            return new Promise((resolve, reject) => {
                this.connection.query(`SELECT * FROM admins WHERE username = ? AND password = ?`, [username, password], (err, data) => {
                    err ? reject(err.sqlMessage) : resolve(data);
                });
            });
        };
        this.getAll = (table) => {
            return new Promise((resolve, reject) => {
                let sql = "SELECT * FROM " + table;
                this.connection.query(sql, (err, data) => {
                    err ? reject(err.sqlMessage) : resolve(data);
                });
            });
        };
        this.getById = (id, table) => {
            if (typeof id !== "number" && typeof table !== "string") {
                return new Promise((resolve, reject) => reject(new SyntaxError("Id be of type 'number' and table name must be type 'string'")));
            }
            return new Promise((resolve, reject) => {
                let sql = "SELECT * FROM " + table + " WHERE id = ?";
                this.connection.query(sql, [id], (err, data) => {
                    err ? reject(err.sqlMessage) : resolve(data);
                });
            });
        };
        this.getNotifications = () => {
            return new Promise((resolve, reject) => {
                let sql = "SELECT * FROM notifications WHERE status = 0";
                this.connection.query(sql, (err, data) => {
                    err ? reject(err.sqlMessage) : resolve(data);
                });
            });
        };
        this.getByColumnName = (columnName, value, table) => {
            if (typeof columnName && typeof value && typeof table !== "string") {
                return new Promise((resolve, reject) => reject(new SyntaxError("Must be of type 'string'")));
            }
            return new Promise((resolve, reject) => {
                let sql = `SELECT * FROM ${table} WHERE ${columnName} = ?`;
                this.connection.query(sql, [value], (err, data) => {
                    err ? reject(err.sqlMessage) : resolve(data);
                });
            });
        };
        this.updateByColumnName = (columnName, value, table, id) => {
            if (typeof columnName && typeof value && typeof table !== "string") {
                return new Promise((resolve, reject) => reject(new SyntaxError("Must be of type 'string'")));
            }
            return new Promise((resolve, reject) => {
                let sql = `UPDATE ${table} SET ${columnName} = ? WHERE id = ?`;
                this.connection.query(sql, [value, id], (err, data) => {
                    err ? reject(err.sqlMessage) : resolve(data);
                });
            });
        };
        this.updateProducts = (name, category, amount, quantity, image, id) => {
            return new Promise((resolve, reject) => {
                let sql = `UPDATE products SET name = ?, category = ?, amount = ?, quantity = ? ${image ? ", image = ?" : ""} WHERE id = ${id}`;
                this.connection.query(sql, [name, category, amount, quantity, image], (err, data) => {
                    err ? reject(err.sqlMessage) : resolve(data);
                });
            });
        };
        this.updateBlog = (title, body, image, id) => {
            return new Promise((resolve, reject) => {
                let sql = `UPDATE blogs SET title = ?, body = ?${image ? ", image = ?" : ""} WHERE id = ${id}`;
                this.connection.query(sql, [title, body, image], (err, data) => {
                    err ? reject(err.sqlMessage) : resolve(data);
                });
            });
        };
        this.delete = (table, id) => {
            if (typeof id !== "number" && typeof table !== "string") {
                return new Promise((resolve, reject) => reject(new SyntaxError("Must be of type 'string'")));
            }
            return new Promise((resolve, reject) => {
                let sql = `DELETE FROM ${table} WHERE id = ?`;
                this.connection.query(sql, [id], (err, data) => {
                    err ? reject(err.sqlMessage) : resolve(data);
                });
            });
        };
        this.insert = (table, values) => {
            if (typeof table !== "string" && typeof values !== "object") {
                return new Promise((_resolve, reject) => reject(new SyntaxError("Must be of type 'string'")));
            }
            return new Promise((resolve, reject) => {
                let keyArray = [];
                let valueArray = [];
                let sqlInject = [];
                for (let key in values) {
                    keyArray.push(key);
                    valueArray.push(`${mysql_1.default.escape(values[key])}`);
                    sqlInject.push("?");
                }
                let sql = `INSERT INTO ${table} (${keyArray.join(", ")}) VALUES(${valueArray.join(", ")})`;
                this.connection.query(sql, (err, data) => {
                    err ? reject(err) : resolve(data);
                });
            });
        };
        this.connection = connection;
    }
    get returnConnection() {
        return this.connection;
    }
}
const db = new dbQueries(db_1.default);
exports.default = db;
