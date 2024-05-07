import { Request, Response, NextFunction } from "express";
import { checkPassword, hashPassword } from "../utils/hashpw";
import Users from "../models/Users";
import HttpError from "../utils/httpError";

export async function allUser(req: Request, res: Response, next: NextFunction) {
  let users;
  try {
    users = await Users.find();
  } catch (error: any) {
    return next(new HttpError("internal server error", 501));
  }
  res.json({ users: users.map((u) => u.toObject({ getters: true })) });
}

export async function signUp(req: Request, res: Response, next: NextFunction) {
  const { name, email, password } = req.body as { name: string; email: string; password: string };

  const hashPwd = await hashPassword(password);

  const user = await Users.findOne({ email });
  if (user) {
    return next(new HttpError("user already exist", 404));
  }

  try {
    const users = new Users({
      name,
      email,
      password: hashPwd,
    });
    await users.save();
  } catch (err: any) {
    return next(new HttpError("internal server error", 501));
  }

  res.json({ message: "success created user" });
}

export async function signIn(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body as { email: string; password: string };

  const users = await Users.findOne({ email });

  if (!users) {
    return next(new HttpError("user not found", 404));
  }

  const passwordIsCorrect = await checkPassword(password, users.password);

  if (!passwordIsCorrect) {
    return next(new HttpError("wrong password", 401));
  }

  req.session.user = {
    email: users.email,
    name: users.name,
    sid: users.id,
  };

  res.json({
    message: "success login",
    session: req.session.user,
  });
}

export async function admin(req: Request, res: Response, next: NextFunction) {
  res.json({ session: req.session.user, page: "admin pages" });
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  req.session.user = null;
  res.json({ message: "success logout" });
}
