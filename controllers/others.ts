import { Request, Response } from "express";
import {
  checkIfEmpty,
  format_text,
  returnJSONError,
  returnJSONSuccess,
  sendEmail,
} from "../utils/functions";
import db from "../utils/mysqlApi";
import logger from "../utils/logger";

export const dashboardOverview = async (req: Request, res: Response) => {
  const [
    [{ total_revenue }],
    [{ total_orders }],
    [{ total_cat }],
    [{ total_products }],
  ] = await db.getOverview();
  return returnJSONSuccess(res, {
    data: {
      total_revenue,
      total_orders,
      total_cat,
      total_products,
    },
  });
};
export const passwordReset = async (req: Request, res: Response) => {
  const {
    old,
    password,
    confirm,
  }: { old: string; password: string; confirm: string } = req.body;
  const validityState = checkIfEmpty([
    { "Old password": old },
    { "New password": password },
    { "Confirm password": confirm },
  ]);
  if (validityState.length > 0) {
    return returnJSONError(res, { message: validityState[0] }, 400);
  }
  const result = await db.getUser(req.session.user, old);
  if (result.length === 0) {
    return returnJSONError(res, { message: "Wrong old password" });
  } else {
    if (password !== confirm) {
      return returnJSONError(res, { message: "password does not match" }, 400);
    }
    await db.updateByColumnName("password", password, "admins", result[0].id);
    return returnJSONSuccess(res);
  }
};
export const getNotifications = async (req: Request, res: Response) => {
  const data = await db.getNotifications();
  returnJSONSuccess(res, { data });
};
export const getGallery = async (req: Request, res: Response) => {
  const { category } = req.query;
  let sql = ``;
  if (category) {
    sql = "SELECT * FROM gallery WHERE category = ?";
  } else {
    sql = "SELECT * FROM gallery";
  }

  const data = await db.queryString(sql, [category]);
  returnJSONSuccess(res, { data });
};
export const mailer = async (req: Request, res: Response) => {
  const {
    email,
    subject,
    message,
  }: { email: string; subject: string; message: string } = req.body;

  let validityState = checkIfEmpty([
    { email: email.trim() },
    { subject: subject.trim() },
    { message: message.trim() },
  ]);
  if (validityState.length > 0) {
    return returnJSONError(res, { message: validityState[0] }, 400);
  }
  let result = await sendEmail("Bonjour Meals", subject, email, message);
  if (!result.status) {
    logger.error("mail error", { result });
    return returnJSONError(res, { message: "Failed to send mail" }, 500);
  }
  returnJSONSuccess(res);
};
export const addGallery = async (req: Request, res: Response) => {
  const { category }: { category: string } = req.body;
  let images = Array.from(req.files as []);
  let validityState = checkIfEmpty([{ category }, { images }]);
  if (validityState.length > 0) {
    return returnJSONError(res, { message: validityState[0] }, 400);
  }
  let filenames = images?.map((file: { filename: string }) => file?.filename);
  await db.insert("gallery", {
    category: format_text(category),
    image: JSON.stringify(filenames),
  });
  returnJSONSuccess(res);
};
export const contactus = async (req: Request, res: Response) => {
  const { name, email, tel, subject, message } = req.body;
  let validityState = checkIfEmpty([
    { email },
    { name },
    { tel },
    { subject },
    { message },
  ]);
  if (validityState.length > 0) {
    return returnJSONError(res, { message: validityState[0] }, 400);
  }
  const response = await sendEmail(
    `${name}`,
    subject,
    [
      "info@bonjourmealslimited.com",
      "enquries@bonjourmealslimited.com",
      "complains@bonjourmealslimited.com",
    ],
    `<p>${message}</p>`
  );
  if (response.status) {
    returnJSONSuccess(res);
  } else {
    returnJSONError(res, { message: "failed to contact support team" });
  }
};
