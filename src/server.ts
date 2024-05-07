import mongoose from "mongoose";
import session from "express-session";
import { TUser } from "./types/session.type";
import express, { Request, Response, NextFunction } from "express";

import UserRouter from "./routers/UsersRouters";
import HttpError from "./utils/httpError";

const app = express();
const port: number = 5544;

declare module "express-session" {
  interface SessionData {
    user: TUser;
  }
}

app.use(
  session({
    secret: "qwertyuiop123",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/auth", UserRouter);
app.use((req: Request, res: Response, next: NextFunction) => {
  return next(new HttpError("route cannot be found", 404));
});
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || 500).json({ message: error.message, code: error.status });
});

mongoose
  .connect(
    "mongodb+srv://rizqi:jQxpLZyxbhjLvP8f@atlascluster.yccwwdp.mongodb.net/places_db?retryWrites=true&w=majority&appName=AtlasCluster"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`connect DB http://localhost:${port}`);
    });
  })
  .catch((err: any) => {
    console.log(err.message);
  });
