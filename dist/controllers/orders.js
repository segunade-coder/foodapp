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
exports.addOrder = exports.updateSingleOrder = exports.getSingleOrder = exports.getOrders = void 0;
const functions_1 = require("../utils/functions");
const mysqlApi_1 = __importDefault(require("../utils/mysqlApi"));
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield mysqlApi_1.default.getData("orders");
    (0, functions_1.returnJSONSuccess)(res, { data });
});
exports.getOrders = getOrders;
const getSingleOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (id) {
        const data = yield mysqlApi_1.default.queryString("SELECT * FROM orders WHERE id = ?", [
            id,
        ]);
        (0, functions_1.returnJSONSuccess)(res, { data: data[0] });
    }
    else {
        return (0, functions_1.returnJSONError)(res, { message: "Invalid request" });
    }
});
exports.getSingleOrder = getSingleOrder;
const updateSingleOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    if (id && status) {
        yield mysqlApi_1.default.queryString("UPDATE orders SET status = ? WHERE id = ?", [
            status,
            id,
        ]);
        (0, functions_1.returnJSONSuccess)(res);
    }
    else {
        return (0, functions_1.returnJSONError)(res, { message: "Invalid request" });
    }
});
exports.updateSingleOrder = updateSingleOrder;
const addOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cart, companyName, email, fullname, payment, phoneNo, street, town, amount, } = req.body;
    let checkValidity = (0, functions_1.checkIfEmpty)([
        { email },
        { fullname },
        { payment },
        { phoneNo },
        { street },
        { town },
        { amount },
    ]);
    if (checkValidity.length === 0) {
        if (cart.length > 0) {
            const cartInfo = yield mysqlApi_1.default.query(`SELECT id, name, amount, image FROM products WHERE id IN (${cart
                .map((item) => item.id)
                .join(", ")})`);
            yield mysqlApi_1.default.insert("orders", {
                fullname,
                companyName,
                email,
                payment,
                phoneNo,
                street,
                town,
                amount,
                products: JSON.stringify(cartInfo.map((item) => {
                    var _a;
                    return ({
                        id: item.id,
                        amount: item.amount,
                        quantity: (_a = cart.find((c) => parseInt(c.id) === parseInt(item.id))
                            .quantity) !== null && _a !== void 0 ? _a : 1,
                        image: item.image,
                        name: item.name,
                    });
                })),
                status: "pending",
                order_id: (0, functions_1.generateOrderId)(7),
            });
            yield mysqlApi_1.default.insert("notifications", {
                title: "Order Placed",
                message: `${fullname} ordered for ${cart.length} product${cart.length > 1 ? "s" : ""}`,
                status: 0,
            });
            return (0, functions_1.returnJSONSuccess)(res);
        }
        return (0, functions_1.returnJSONError)(res, { message: "no cart" }, 400);
    }
    else {
        return (0, functions_1.returnJSONError)(res, { message: checkValidity[0] }, 400);
    }
});
exports.addOrder = addOrder;
