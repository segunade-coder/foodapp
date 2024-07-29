import mysql, { Connection } from "mysql";
// import { cash, settings, people, tasks } from "../types";
import connection from "../configs/db";
type TableType = string;
class dbQueries {
  connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }
  createTable = (
    table: TableType,
    ...params:
      | [
          {
            columnName: string;
            dataType: string;
            condition?: string;
            dataTypeLength?: string;
          }
        ]
      | any[]
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      let query_string: string = ``;
      let columnNames: string[] = [];
      let dataType: string[] = [];
      let condition: string[] | any = [];
      let dataTypeLength: any[] = [];
      let qry = "";
      params.forEach((param) => {
        columnNames.push(param.columnName);
        dataType.push(param.dataType);
        param?.dataTypeLength !== undefined
          ? dataTypeLength.push("(" + param?.dataTypeLength + ")")
          : dataTypeLength.push(null);

        condition.push(param?.condition || null);
      });
      for (let i = 0; i < columnNames.length; i++) {
        qry += `${columnNames[i]} ${dataType[i].toUpperCase()}${
          dataTypeLength[i] || ""
        } ${condition[i] || ""} ${i === columnNames.length - 1 ? "" : ","} `;
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
  query = (query: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      this.connection.query(query, (err, data) => {
        err ? reject(err) : resolve(data);
      });
    });
  };
  getOverview = (): Promise<Overview[][]> => {
    return new Promise((resolve, reject) => {
      this.connection.query(
        "SELECT SUM(amount) AS total_revenue FROM orders WHERE status = 'delivered';SELECT COUNT(*) AS total_orders FROM orders;SELECT COUNT(*) AS total_cat FROM categories; SELECT COUNT(*) AS total_products FROM products;",
        (err, data) => {
          err ? reject(err) : resolve(data);
        }
      );
    });
  };
  getData = (category: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      this.connection.query(`SELECT * FROM ${category}`, (err, data) => {
        err ? reject(err) : resolve(data);
      });
    });
  };
  queryString = (query: string, options: any[] = []): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      this.connection.query(query, options, (err, data) => {
        err ? reject(err.sqlMessage) : resolve(data);
      });
    });
  };
  getUser = (username: string = "", password: string = ""): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT * FROM admins WHERE username = ? AND password = ?`,
        [username, password],
        (err, data) => {
          err ? reject(err.sqlMessage) : resolve(data);
        }
      );
    });
  };
  get returnConnection() {
    return this.connection;
  }
  getAll = (table: string) => {
    return new Promise((resolve, reject) => {
      let sql = "SELECT * FROM " + table;
      this.connection.query(sql, (err, data) => {
        err ? reject(err.sqlMessage) : resolve(data);
      });
    });
  };
  getById = (id: string, table: string) => {
    if (typeof id !== "number" && typeof table !== "string") {
      return new Promise((resolve, reject) =>
        reject(
          new SyntaxError(
            "Id be of type 'number' and table name must be type 'string'"
          )
        )
      );
    }
    return new Promise((resolve, reject) => {
      let sql = "SELECT * FROM " + table + " WHERE id = ?";
      this.connection.query(sql, [id], (err, data) => {
        err ? reject(err.sqlMessage) : resolve(data);
      });
    });
  };
  getNotifications = () => {
    return new Promise((resolve, reject) => {
      let sql = "SELECT * FROM notifications WHERE status = 0";
      this.connection.query(sql, (err, data) => {
        err ? reject(err.sqlMessage) : resolve(data);
      });
    });
  };
  getByColumnName = (columnName: string, value: string, table: string) => {
    if (typeof columnName && typeof value && typeof table !== "string") {
      return new Promise((resolve, reject) =>
        reject(new SyntaxError("Must be of type 'string'"))
      );
    }
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM ${table} WHERE ${columnName} = ?`;
      this.connection.query(sql, [value], (err, data) => {
        err ? reject(err.sqlMessage) : resolve(data);
      });
    });
  };

  updateByColumnName = (
    columnName: string,
    value: string,
    table: string,
    id: number
  ) => {
    if (typeof columnName && typeof value && typeof table !== "string") {
      return new Promise((resolve, reject) =>
        reject(new SyntaxError("Must be of type 'string'"))
      );
    }
    return new Promise((resolve, reject) => {
      let sql = `UPDATE ${table} SET ${columnName} = ? WHERE id = ?`;
      this.connection.query(sql, [value, id], (err, data) => {
        err ? reject(err.sqlMessage) : resolve(data);
      });
    });
  };
  updateProducts = (
    name: string,
    category: string,
    amount: number,
    quantity: number,
    image: string | undefined,
    id: number
  ) => {
    return new Promise((resolve, reject) => {
      let sql = `UPDATE products SET name = ?, category = ?, amount = ?, quantity = ? ${
        image ? ", image = ?" : ""
      } WHERE id = ${id}`;
      this.connection.query(
        sql,
        [name, category, amount, quantity, image],
        (err, data) => {
          err ? reject(err.sqlMessage) : resolve(data);
        }
      );
    });
  };
  updateBlog = (
    title: string,
    body: string,
    image: string | undefined,
    id: number
  ) => {
    return new Promise((resolve, reject) => {
      let sql = `UPDATE blogs SET title = ?, body = ?${
        image ? ", image = ?" : ""
      } WHERE id = ${id}`;
      this.connection.query(sql, [title, body, image], (err, data) => {
        err ? reject(err.sqlMessage) : resolve(data);
      });
    });
  };

  delete = (table: string, id: number | any) => {
    if (typeof id !== "number" && typeof table !== "string") {
      return new Promise((resolve, reject) =>
        reject(new SyntaxError("Must be of type 'string'"))
      );
    }
    return new Promise((resolve, reject) => {
      let sql = `DELETE FROM ${table} WHERE id = ?`;
      this.connection.query(sql, [id], (err, data) => {
        err ? reject(err.sqlMessage) : resolve(data);
      });
    });
  };
  insert = (table: string, values: any) => {
    if (typeof table !== "string" && typeof values !== "object") {
      return new Promise((_resolve, reject) =>
        reject(new SyntaxError("Must be of type 'string'"))
      );
    }
    return new Promise((resolve, reject) => {
      let keyArray = [];
      let valueArray = [];
      let sqlInject = [];
      for (let key in values) {
        keyArray.push(key);
        valueArray.push(`${mysql.escape(values[key as keyof typeof values])}`);
        sqlInject.push("?");
      }
      let sql = `INSERT INTO ${table} (${keyArray.join(
        ", "
      )}) VALUES(${valueArray.join(", ")})`;
      this.connection.query(sql, (err, data) => {
        err ? reject(err) : resolve(data);
      });
    });
  };
}
const db = new dbQueries(connection);
export default db;
