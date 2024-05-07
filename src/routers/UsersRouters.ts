import express from "express";
import { allUser, signUp, signIn, admin, logout } from "../controllers/UsersControllers";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.get("/", allUser);
router.get("/admin", authMiddleware, admin);
router.get("/logout", authMiddleware, logout);

router.post("/signup", signUp);
router.post("/signin", signIn);

export default router;
