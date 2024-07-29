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
exports.getProductsById = exports.getProductById = exports.deleteProduct = exports.editProduct = exports.createProduct = exports.getProducts = void 0;
const functions_1 = require("../utils/functions");
const mysqlApi_1 = __importDefault(require("../utils/mysqlApi"));
const getProducts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield mysqlApi_1.default.getData("products");
    (0, functions_1.returnJSONSuccess)(res, { data });
});
exports.getProducts = getProducts;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, category, amount, quantity, } = req.body;
    const image_name = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
    const checkValidity = (0, functions_1.checkIfEmpty)([{ name }, { category }, { amount }]);
    if (checkValidity.length > 0) {
        return (0, functions_1.returnJSONError)(res, { message: checkValidity[0] }, 400);
    }
    yield mysqlApi_1.default.insert("products", {
        name: (0, functions_1.format_text)(name),
        category: (0, functions_1.format_text)(category),
        amount,
        quantity: quantity !== null && quantity !== void 0 ? quantity : 0,
        image: image_name,
    });
    (0, functions_1.returnJSONSuccess)(res);
});
exports.createProduct = createProduct;
const editProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { name, category, amount, quantity, id, } = req.body;
    const image = (_b = req.file) === null || _b === void 0 ? void 0 : _b.filename;
    if (id) {
        const checkValidity = (0, functions_1.checkIfEmpty)([{ name }, { category }, { amount }]);
        if (checkValidity.length > 0) {
            return (0, functions_1.returnJSONError)(res, { message: checkValidity[0] }, 400);
        }
        yield mysqlApi_1.default.updateProducts((0, functions_1.format_text)(name), (0, functions_1.format_text)(category), amount, quantity, image, id);
        return (0, functions_1.returnJSONSuccess)(res);
    }
    else {
        (0, functions_1.returnJSONError)(res, { message: "Invalid request" }, 400);
    }
});
exports.editProduct = editProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    if (id) {
        yield mysqlApi_1.default.delete("products", id);
        (0, functions_1.returnJSONSuccess)(res);
    }
    else {
        (0, functions_1.returnJSONError)(res, { message: "Invalid request" }, 400);
    }
});
exports.deleteProduct = deleteProduct;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.params;
    if (category) {
        const data = yield mysqlApi_1.default.queryString("SELECT id, name, amount, image FROM products WHERE category = ? AND quantity > 0", [category]);
        return (0, functions_1.returnJSONSuccess)(res, { data });
    }
    (0, functions_1.returnJSONError)(res, { message: "Invalid request" }, 400);
});
exports.getProductById = getProductById;
const getProductsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (id && id.length > 0) {
        const data = yield mysqlApi_1.default.query(`SELECT id, name, amount, image FROM products WHERE id IN (${id.join(", ")})`);
        return (0, functions_1.returnJSONSuccess)(res, { data });
    }
    (0, functions_1.returnJSONError)(res, { message: "Invalid request" }, 400);
});
exports.getProductsById = getProductsById;
