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
exports.getBlogById = exports.deleteBlog = exports.editBlog = exports.createBlog = exports.getBlogs = void 0;
const functions_1 = require("../utils/functions");
const mysqlApi_1 = __importDefault(require("../utils/mysqlApi"));
const getBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield mysqlApi_1.default.query("SELECT * FROM blogs WHERE status = 'publish'");
    return (0, functions_1.returnJSONSuccess)(res, { data });
});
exports.getBlogs = getBlogs;
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, body, status, } = req.body;
    const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
    const validityState = (0, functions_1.checkIfEmpty)([{ title }, { body }]);
    if (validityState.length > 0) {
        return (0, functions_1.returnJSONError)(res, { message: validityState[0] });
    }
    yield mysqlApi_1.default.insert("blogs", {
        title: (0, functions_1.format_text)(title),
        body: body === null || body === void 0 ? void 0 : body.trim(),
        status: status !== null && status !== void 0 ? status : "pending",
        image: image,
    });
    return (0, functions_1.returnJSONSuccess)(res);
});
exports.createBlog = createBlog;
const editBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { title, body, id } = req.body;
    if (id) {
        const validityState = (0, functions_1.checkIfEmpty)([{ title }, { body }]);
        const image = (_b = req.file) === null || _b === void 0 ? void 0 : _b.filename;
        if (validityState.length > 0) {
            return (0, functions_1.returnJSONError)(res, { message: validityState[0] });
        }
        yield mysqlApi_1.default.updateBlog(title, body, image, id);
        return (0, functions_1.returnJSONSuccess)(res);
    }
    else {
        return (0, functions_1.returnJSONError)(res, { message: "Invalid request" }, 400);
    }
});
exports.editBlog = editBlog;
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const id = (_c = req.query) === null || _c === void 0 ? void 0 : _c.id;
    if (id) {
        yield mysqlApi_1.default.delete("blogs", id);
        return (0, functions_1.returnJSONSuccess)(res);
    }
    return (0, functions_1.returnJSONError)(res, {}, 400);
});
exports.deleteBlog = deleteBlog;
const getBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (id) {
        const data = yield mysqlApi_1.default.queryString("SELECT * FROM blogs WHERE id = ?", [id]);
        return (0, functions_1.returnJSONSuccess)(res, { data });
    }
    (0, functions_1.returnJSONError)(res, { message: "Invalid request" }, 400);
});
exports.getBlogById = getBlogById;
