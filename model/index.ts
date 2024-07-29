import db from "../utils/mysqlApi";

export const model = async () => {
  await db.createTable(
    "admins",
    {
      columnName: "username",
      dataType: "varchar",
      condition: "NOT NULL",
      dataTypeLength: "200",
    },
    {
      columnName: "password",
      dataType: "varchar",
      condition: "NOT NULL",
      dataTypeLength: "200",
    }
  );
  await db.createTable(
    "gallery",
    {
      columnName: "category",
      dataType: "varchar",
      condition: "NOT NULL",
      dataTypeLength: "100",
    },
    {
      columnName: "image",
      dataType: "varchar",
      condition: "NOT NULL",
      dataTypeLength: "250",
    }
  );
  await db.createTable(
    "notifications",
    {
      columnName: "title",
      dataType: "varchar",
      condition: "NOT NULL",
      dataTypeLength: "50",
    },
    {
      columnName: "message",
      dataType: "varchar",
      condition: "NOT NULL",
      dataTypeLength: "200",
    },
    {
      columnName: "status",
      dataType: "int",
      condition: "NOT NULL",
      dataTypeLength: "11",
    }
  );
  await db.createTable("categories", {
    columnName: "name",
    dataType: "varchar",
    condition: "NOT NULL",
    dataTypeLength: "200",
  });
  await db.createTable(
    "orders",
    {
      columnName: "email",
      dataType: "varchar",
      condition: "NOT NULL",
      dataTypeLength: "100",
    },
    {
      columnName: "status",
      dataType: "varchar",
      condition: "NOT NULL",
      dataTypeLength: "50",
    },
    {
      columnName: "amount",
      dataType: "int",
      condition: "NOT NULL",
      dataTypeLength: "11",
    },
    {
      columnName: "order_id",
      dataType: "varchar",
      condition: "NOT NULL",
      dataTypeLength: "100",
    },
    {
      columnName: "fullname",
      dataType: "varchar",
      condition: "NOT NULL",
      dataTypeLength: "100",
    },
    {
      columnName: "street",
      dataType: "varchar",
      condition: "NOT NULL",
      dataTypeLength: "100",
    },
    {
      columnName: "payment",
      dataType: "varchar",
      condition: "NOT NULL",
      dataTypeLength: "100",
    },
    {
      columnName: "phoneNo",
      dataType: "varchar",
      condition: "NOT NULL",
      dataTypeLength: "100",
    },
    {
      columnName: "town",
      dataType: "varchar",
      condition: "NOT NULL",
      dataTypeLength: "100",
    },
    {
      columnName: "companyName",
      dataType: "varchar",
      dataTypeLength: "100",
    },
    {
      columnName: "products",
      dataType: "JSON",
    }
  );
  await db.createTable(
    "products",
    {
      columnName: "name",
      dataType: "varchar",
      condition: "NOT NULL",
      dataTypeLength: "200",
    },
    {
      columnName: "category",
      dataType: "varchar",
      condition: "NOT NULL",
      dataTypeLength: "200",
    },
    {
      columnName: "amount",
      dataType: "int",
      condition: "NOT NULL",
      dataTypeLength: "11",
    },
    {
      columnName: "quantity",
      dataType: "int",
      condition: "NOT NULL",
      dataTypeLength: "11",
    },
    {
      columnName: "image",
      dataType: "varchar",
      condition: "NOT NULL",
      dataTypeLength: "250",
    }
  );
  await db.createTable(
    "blogs",
    {
      columnName: "title",
      dataType: "varchar",
      condition: "NOT NULL",
      dataTypeLength: "100",
    },
    {
      columnName: "body",
      dataType: "varchar",
      condition: "NOT NULL",
      dataTypeLength: "250",
    },
    {
      columnName: "image",
      dataType: "varchar",
      condition: "NOT NULL",
      dataTypeLength: "100",
    },
    {
      columnName: "status",
      dataType: "varchar",
      condition: "NOT NULL",
      dataTypeLength: "20",
    }
  );
};
