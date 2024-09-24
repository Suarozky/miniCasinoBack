import express from "express";
import { createUser, login, refreshToken } from "../controllers/auth";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

export default router;
