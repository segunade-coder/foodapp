import { Request, Response } from "express";
import {
  checkIfEmpty,
  format_text,
  returnJSONError,
  returnJSONSuccess,
} from "../utils/functions";
import db from "../utils/mysqlApi";

export const getProducts = async (_req: Request, res: Response) => {
  const data = await db.getData("products");
  returnJSONSuccess(res, { data });
};

export const createProduct = async (req: Request, res: Response) => {
  const {
    name,
    category,
    amount,
    quantity,
  }: { name: string; category: string; amount: number; quantity: number } =
    req.body;
  const image_name = req.file?.filename;
  const checkValidity = checkIfEmpty([{ name }, { category }, { amount }]);

  if (checkValidity.length > 0) {
    return returnJSONError(res, { message: checkValidity[0] }, 400);
  }
  await db.insert("products", {
    name: format_text(name),
    category: format_text(category),
    amount,
    quantity: quantity ?? 0,
    image: image_name,
  });
  returnJSONSuccess(res);
};
export const editProduct = async (req: Request, res: Response) => {
  const {
    name,
    category,
    amount,
    quantity,
    id,
  }: {
    name: string;
    category: string;
    amount: number;
    quantity: number;
    id: number;
  } = req.body;
  const image = req.file?.filename;
  if (id) {
    const checkValidity = checkIfEmpty([{ name }, { category }, { amount }]);
    if (checkValidity.length > 0) {
      return returnJSONError(res, { message: checkValidity[0] }, 400);
    }
    await db.updateProducts(
      format_text(name),
      format_text(category),
      amount,
      quantity,
      image,
      id
    );
    return returnJSONSuccess(res);
  } else {
    returnJSONError(res, { message: "Invalid request" }, 400);
  }
};
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.query;
  if (id) {
    await db.delete("products", id);
    returnJSONSuccess(res);
  } else {
    returnJSONError(res, { message: "Invalid request" }, 400);
  }
};
export const getProductById = async (req: Request, res: Response) => {
  const { category } = req.params;
  if (category) {
    const data = await db.queryString(
      "SELECT id, name, amount, image FROM products WHERE category = ? AND quantity > 0",
      [category]
    );
    return returnJSONSuccess(res, { data });
  }
  returnJSONError(res, { message: "Invalid request" }, 400);
};
export const getProductsById = async (req: Request, res: Response) => {
  const { id } = req.body;
  if (id && id.length > 0) {
    const data = await db.query(
      `SELECT id, name, amount, image FROM products WHERE id IN (${id.join(
        ", "
      )})`
    );
    return returnJSONSuccess(res, { data });
  }
  returnJSONError(res, { message: "Invalid request" }, 400);
};
