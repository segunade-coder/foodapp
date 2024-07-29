"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.model = void 0;
const mysqlApi_1 = __importDefault(require("../utils/mysqlApi"));
const model = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mysqlApi_1.default.createTable("admins", {
        columnName: "username",
        dataType: "varchar",
        condition: "NOT NULL",
        dataTypeLength: "200",
    }, {
        columnName: "password",
        dataType: "varchar",
        condition: "NOT NULL",
        dataTypeLength: "200",
    });
    yield mysqlApi_1.default.createTable("gallery", {
        columnName: "category",
        dataType: "varchar",
        condition: "NOT NULL",
        dataTypeLength: "100",
    }, {
        columnName: "image",
        dataType: "varchar",
        condition: "NOT NULL",
        dataTypeLength: "250",
    });
    yield mysqlApi_1.default.createTable("notifications", {
        columnName: "title",
        dataType: "varchar",
        condition: "NOT NULL",
        dataTypeLength: "50",
    }, {
        columnName: "message",
        dataType: "varchar",
        condition: "NOT NULL",
        dataTypeLength: "200",
    }, {
        columnName: "status",
        dataType: "int",
        condition: "NOT NULL",
        dataTypeLength: "11",
    });
    yield mysqlApi_1.default.createTable("categories", {
        columnName: "name",
        dataType: "varchar",
        condition: "NOT NULL",
        dataTypeLength: "200",
    });
    yield mysqlApi_1.default.createTable("orders", {
        columnName: "email",
        dataType: "varchar",
        condition: "NOT NULL",
        dataTypeLength: "100",
    }, {
        columnName: "status",
        dataType: "varchar",
        condition: "NOT NULL",
        dataTypeLength: "50",
    }, {
        columnName: "amount",
        dataType: "int",
        condition: "NOT NULL",
        dataTypeLength: "11",
    }, {
        columnName: "order_id",
        dataType: "varchar",
        condition: "NOT NULL",
        dataTypeLength: "100",
    }, {
        columnName: "fullname",
        dataType: "varchar",
        condition: "NOT NULL",
        dataTypeLength: "100",
    }, {
        columnName: "street",
        dataType: "varchar",
        condition: "NOT NULL",
        dataTypeLength: "100",
    }, {
        columnName: "payment",
        dataType: "varchar",
        condition: "NOT NULL",
        dataTypeLength: "100",
    }, {
        columnName: "phoneNo",
        dataType: "varchar",
        condition: "NOT NULL",
        dataTypeLength: "100",
    }, {
        columnName: "town",
        dataType: "varchar",
        condition: "NOT NULL",
        dataTypeLength: "100",
    }, {
        columnName: "companyName",
        dataType: "varchar",
        dataTypeLength: "100",
    }, {
        columnName: "products",
        dataType: "JSON",
    });
    yield mysqlApi_1.default.createTable("products", {
        columnName: "name",
        dataType: "varchar",
        condition: "NOT NULL",
        dataTypeLength: "200",
    }, {
        columnName: "category",
        dataType: "varchar",
        condition: "NOT NULL",
        dataTypeLength: "200",
    }, {
        columnName: "amount",
        dataType: "int",
        condition: "NOT NULL",
        dataTypeLength: "11",
    }, {
        columnName: "quantity",
        dataType: "int",
        condition: "NOT NULL",
        dataTypeLength: "11",
    }, {
        columnName: "image",
        dataType: "varchar",
        condition: "NOT NULL",
        dataTypeLength: "250",
    });
    yield mysqlApi_1.default.createTable("blogs", {
        columnName: "title",
        dataType: "varchar",
        condition: "NOT NULL",
        dataTypeLength: "100",
    }, {
        columnName: "body",
        dataType: "varchar",
        condition: "NOT NULL",
        dataTypeLength: "250",
    }, {
        columnName: "image",
        dataType: "varchar",
        condition: "NOT NULL",
        dataTypeLength: "100",
    }, {
        columnName: "status",
        dataType: "varchar",
        condition: "NOT NULL",
        dataTypeLength: "20",
    });
});
exports.model = model;
