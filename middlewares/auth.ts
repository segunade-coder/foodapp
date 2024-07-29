import { NextFunction, Request, Response } from "express";
import { returnJSONError } from "../utils/functions";

export function checkAuth(req: Request, res: Response, next: NextFunction) {
  if (req?.session?.user || req.path === "/login") next();
  else {
    res.status(403).redirect("/auth-login.html");
  }
}
