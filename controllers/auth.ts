import { Request, Response } from "express";
import {
  checkIfEmpty,
  isValidated,
  returnJSONError,
  returnJSONSuccess,
} from "../utils/functions";
import db from "../utils/mysqlApi";
import logger from "../utils/logger";

export const userLogin = async (req: Request, res: Response) => {
  const { username, password }: { username: string; password: string } =
    req.body;

  const checkValidity = checkIfEmpty([{ username }, { password }]);

  if (checkValidity.length > 0) {
    return returnJSONError(res, { message: checkValidity[0] }, 400);
  }
  let result = await db.getUser(username, password);
  if (isValidated(result)) {
    req.session.user = result[0].username;
    req.session.user_id = result[0].id;
    return returnJSONSuccess(res);
  } else {
    returnJSONError(res, { message: "Invalid credentials" }, 400);
  }
};
export const userLogout = async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      logger.error(err);
      return returnJSONError(res, { message: "Something went wrong" }, 500);
    }
    return res.status(201).redirect("/auth-login.html");
  });
};
