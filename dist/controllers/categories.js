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
exports.deleteCategory = exports.editCategory = exports.createCategory = exports.getCategories = void 0;
const functions_1 = require("../utils/functions");
const mysqlApi_1 = __importDefault(require("../utils/mysqlApi"));
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield mysqlApi_1.default.getData("categories");
    return (0, functions_1.returnJSONSuccess)(res, { data });
});
exports.getCategories = getCategories;
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const checkValidity = (0, functions_1.checkIfEmpty)([{ name }]);
    if (checkValidity.length > 0) {
        return (0, functions_1.returnJSONError)(res, { message: checkValidity[0] }, 400);
    }
    yield mysqlApi_1.default.insert("categories", {
        name: (0, functions_1.format_text)(name),
    });
    (0, functions_1.returnJSONSuccess)(res);
});
exports.createCategory = createCategory;
const editCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, id } = req.body;
    if (id) {
        const checkValidity = (0, functions_1.checkIfEmpty)([{ name }]);
        if (checkValidity.length > 0) {
            return (0, functions_1.returnJSONError)(res, { message: checkValidity[0] }, 400);
        }
        yield mysqlApi_1.default.updateByColumnName("name", (0, functions_1.format_text)(name), "categories", id);
        return (0, functions_1.returnJSONSuccess)(res);
    }
    else {
        (0, functions_1.returnJSONError)(res, { message: "Invalid request" }, 400);
    }
});
exports.editCategory = editCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    if (id) {
        yield mysqlApi_1.default.delete("categories", id);
        (0, functions_1.returnJSONSuccess)(res);
    }
    else {
        (0, functions_1.returnJSONError)(res, { message: "Invalid request" }, 400);
    }
});
exports.deleteCategory = deleteCategory;
