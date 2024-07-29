import { Request, Response } from "express";
import {
  checkIfEmpty,
  format_text,
  returnJSONError,
  returnJSONSuccess,
} from "../utils/functions";
import db from "../utils/mysqlApi";

export const getCategories = async (req: Request, res: Response) => {
  const data = await db.getData("categories");
  return returnJSONSuccess(res, { data });
};

export const createCategory = async (req: Request, res: Response) => {
  const { name }: { name: string } = req.body;
  const checkValidity = checkIfEmpty([{ name }]);

  if (checkValidity.length > 0) {
    return returnJSONError(res, { message: checkValidity[0] }, 400);
  }
  await db.insert("categories", {
    name: format_text(name),
  });
  returnJSONSuccess(res);
};
export const editCategory = async (req: Request, res: Response) => {
  const { name, id }: { name: string; id: number } = req.body;
  if (id) {
    const checkValidity = checkIfEmpty([{ name }]);
    if (checkValidity.length > 0) {
      return returnJSONError(res, { message: checkValidity[0] }, 400);
    }
    await db.updateByColumnName("name", format_text(name), "categories", id);
    return returnJSONSuccess(res);
  } else {
    returnJSONError(res, { message: "Invalid request" }, 400);
  }
};
export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.query;
  if (id) {
    await db.delete("categories", id);
    returnJSONSuccess(res);
  } else {
    returnJSONError(res, { message: "Invalid request" }, 400);
  }
};
