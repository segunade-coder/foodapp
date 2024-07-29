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
exports.contactus = exports.addGallery = exports.mailer = exports.getGallery = exports.getNotifications = exports.passwordReset = exports.dashboardOverview = void 0;
const functions_1 = require("../utils/functions");
const mysqlApi_1 = __importDefault(require("../utils/mysqlApi"));
const logger_1 = __importDefault(require("../utils/logger"));
const dashboardOverview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [[{ total_revenue }], [{ total_orders }], [{ total_cat }], [{ total_products }],] = yield mysqlApi_1.default.getOverview();
    return (0, functions_1.returnJSONSuccess)(res, {
        data: {
            total_revenue,
            total_orders,
            total_cat,
            total_products,
        },
    });
});
exports.dashboardOverview = dashboardOverview;
const passwordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { old, password, confirm, } = req.body;
    const validityState = (0, functions_1.checkIfEmpty)([
        { "Old password": old },
        { "New password": password },
        { "Confirm password": confirm },
    ]);
    if (validityState.length > 0) {
        return (0, functions_1.returnJSONError)(res, { message: validityState[0] }, 400);
    }
    const result = yield mysqlApi_1.default.getUser(req.session.user, old);
    if (result.length === 0) {
        return (0, functions_1.returnJSONError)(res, { message: "Wrong old password" });
    }
    else {
        if (password !== confirm) {
            return (0, functions_1.returnJSONError)(res, { message: "password does not match" }, 400);
        }
        yield mysqlApi_1.default.updateByColumnName("password", password, "admins", result[0].id);
        return (0, functions_1.returnJSONSuccess)(res);
    }
});
exports.passwordReset = passwordReset;
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield mysqlApi_1.default.getNotifications();
    (0, functions_1.returnJSONSuccess)(res, { data });
});
exports.getNotifications = getNotifications;
const getGallery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.query;
    let sql = ``;
    if (category) {
        sql = "SELECT * FROM gallery WHERE category = ?";
    }
    else {
        sql = "SELECT * FROM gallery";
    }
    const data = yield mysqlApi_1.default.queryString(sql, [category]);
    (0, functions_1.returnJSONSuccess)(res, { data });
});
exports.getGallery = getGallery;
const mailer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, subject, message, } = req.body;
    let validityState = (0, functions_1.checkIfEmpty)([
        { email: email.trim() },
        { subject: subject.trim() },
        { message: message.trim() },
    ]);
    if (validityState.length > 0) {
        return (0, functions_1.returnJSONError)(res, { message: validityState[0] }, 400);
    }
    let result = yield (0, functions_1.sendEmail)("Bonjour Meals", subject, email, message);
    if (!result.status) {
        logger_1.default.error("mail error", { result });
        return (0, functions_1.returnJSONError)(res, { message: "Failed to send mail" }, 500);
    }
    (0, functions_1.returnJSONSuccess)(res);
});
exports.mailer = mailer;
const addGallery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.body;
    let images = Array.from(req.files);
    let validityState = (0, functions_1.checkIfEmpty)([{ category }, { images }]);
    if (validityState.length > 0) {
        return (0, functions_1.returnJSONError)(res, { message: validityState[0] }, 400);
    }
    let filenames = images === null || images === void 0 ? void 0 : images.map((file) => file === null || file === void 0 ? void 0 : file.filename);
    yield mysqlApi_1.default.insert("gallery", {
        category: (0, functions_1.format_text)(category),
        image: JSON.stringify(filenames),
    });
    (0, functions_1.returnJSONSuccess)(res);
});
exports.addGallery = addGallery;
const contactus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, tel, subject, message } = req.body;
    let validityState = (0, functions_1.checkIfEmpty)([
        { email },
        { name },
        { tel },
        { subject },
        { message },
    ]);
    if (validityState.length > 0) {
        return (0, functions_1.returnJSONError)(res, { message: validityState[0] }, 400);
    }
    const response = yield (0, functions_1.sendEmail)(`${name}`, subject, [
        "info@bonjourmealslimited.com",
        "enquries@bonjourmealslimited.com",
        "complains@bonjourmealslimited.com",
    ], `<p>${message}</p>`);
    if (response.status) {
        (0, functions_1.returnJSONSuccess)(res);
    }
    else {
        (0, functions_1.returnJSONError)(res, { message: "failed to contact support team" });
    }
});
exports.contactus = contactus;
