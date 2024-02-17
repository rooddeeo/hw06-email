import express from "express";
import { validateBody } from "../helpers/validateBody.js";
import { registerSchema, loginSchema } from "../models/user.js";
import { register, login, getCurrent, logout, updateAvatar } from "../controllers/authController.js";
import { authenticate } from "../helpers/authenticate.js";
import { upload } from "../helpers/upload.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.get("/current", authenticate, getCurrent);
authRouter.post("/logout", authenticate, logout);
authRouter.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);
export default authRouter;
