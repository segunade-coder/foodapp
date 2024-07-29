import { Request, Response } from "express";
import {
  checkIfEmpty,
  generateOrderId,
  returnJSONError,
  returnJSONSuccess,
} from "../utils/functions";
import db from "../utils/mysqlApi";

export const getOrders = async (req: Request, res: Response) => {
  const data = await db.getData("orders");
  returnJSONSuccess(res, { data });
};
export const getSingleOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (id) {
    const data = await db.queryString("SELECT * FROM orders WHERE id = ?", [
      id,
    ]);
    returnJSONSuccess(res, { data: data[0] });
  } else {
    return returnJSONError(res, { message: "Invalid request" });
  }
};
export const updateSingleOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  if (id && status) {
    await db.queryString("UPDATE orders SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
    returnJSONSuccess(res);
  } else {
    return returnJSONError(res, { message: "Invalid request" });
  }
};

export const addOrder = async (req: Request, res: Response) => {
  const {
    cart,
    companyName,
    email,
    fullname,
    payment,
    phoneNo,
    street,
    town,
    amount,
  } = req.body;
  let checkValidity = checkIfEmpty([
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
      const cartInfo = await db.query(
        `SELECT id, name, amount, image FROM products WHERE id IN (${cart
          .map((item: any) => item.id)
          .join(", ")})`
      );
      await db.insert("orders", {
        fullname,
        companyName,
        email,
        payment,
        phoneNo,
        street,
        town,
        amount,
        products: JSON.stringify(
          cartInfo.map((item) => ({
            id: item.id,
            amount: item.amount,
            quantity:
              cart.find((c: any) => parseInt(c.id) === parseInt(item.id))
                .quantity ?? 1,
            image: item.image,
            name: item.name,
          }))
        ),
        status: "pending",
        order_id: generateOrderId(7),
      });
      await db.insert("notifications", {
        title: "Order Placed",
        message: `${fullname} ordered for ${cart.length} product${
          cart.length > 1 ? "s" : ""
        }`,
        status: 0,
      });
      return returnJSONSuccess(res);
    }
    return returnJSONError(res, { message: "no cart" }, 400);
  } else {
    return returnJSONError(res, { message: checkValidity[0] }, 400);
  }
};
