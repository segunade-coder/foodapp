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
exports.userLogout = exports.userLogin = void 0;
const functions_1 = require("../utils/functions");
const mysqlApi_1 = __importDefault(require("../utils/mysqlApi"));
const logger_1 = __importDefault(require("../utils/logger"));
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const checkValidity = (0, functions_1.checkIfEmpty)([{ username }, { password }]);
    if (checkValidity.length > 0) {
        return (0, functions_1.returnJSONError)(res, { message: checkValidity[0] }, 400);
    }
    let result = yield mysqlApi_1.default.getUser(username, password);
    if ((0, functions_1.isValidated)(result)) {
        req.session.user = result[0].username;
        req.session.user_id = result[0].id;
        return (0, functions_1.returnJSONSuccess)(res);
    }
    else {
        (0, functions_1.returnJSONError)(res, { message: "Invalid credentials" }, 400);
    }
});
exports.userLogin = userLogin;
const userLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.destroy((err) => {
        if (err) {
            logger_1.default.error(err);
            return (0, functions_1.returnJSONError)(res, { message: "Something went wrong" }, 500);
        }
        return res.status(201).redirect("/auth-login.html");
    });
});
exports.userLogout = userLogout;
