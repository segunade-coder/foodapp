import { Request, Response } from "express";
import {
  checkIfEmpty,
  format_text,
  returnJSONError,
  returnJSONSuccess,
} from "../utils/functions";
import db from "../utils/mysqlApi";

export const getBlogs = async (req: Request, res: Response) => {
  const data = await db.query("SELECT * FROM blogs WHERE status = 'publish'");
  return returnJSONSuccess(res, { data });
};

export const createBlog = async (req: Request, res: Response) => {
  const {
    title,
    body,
    status,
  }: { title: string; body: string; status: string } = req.body;
  const image = req.file?.filename;
  const validityState = checkIfEmpty([{ title }, { body }]);
  if (validityState.length > 0) {
    return returnJSONError(res, { message: validityState[0] });
  }
  await db.insert("blogs", {
    title: format_text(title),
    body: body?.trim(),
    status: status ?? "pending",
    image: image,
  });
  return returnJSONSuccess(res);
};
export const editBlog = async (req: Request, res: Response) => {
  const { title, body, id }: { title: string; body: string; id: number } =
    req.body;
  if (id) {
    const validityState = checkIfEmpty([{ title }, { body }]);
    const image = req.file?.filename;
    if (validityState.length > 0) {
      return returnJSONError(res, { message: validityState[0] });
    }
    await db.updateBlog(title, body, image, id);
    return returnJSONSuccess(res);
  } else {
    return returnJSONError(res, { message: "Invalid request" }, 400);
  }
};
export const deleteBlog = async (req: Request, res: Response) => {
  const id = req.query?.id;
  if (id) {
    await db.delete("blogs", id);
    return returnJSONSuccess(res);
  }
  return returnJSONError(res, {}, 400);
};

export const getBlogById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (id) {
    const data = await db.queryString("SELECT * FROM blogs WHERE id = ?", [id]);
    return returnJSONSuccess(res, { data });
  }
  returnJSONError(res, { message: "Invalid request" }, 400);
};
