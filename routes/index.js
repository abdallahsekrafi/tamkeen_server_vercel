import express from "express";
import authRoute from "./authRoutes.js";
import userRoute from "./userRoutes.js";
import postRoute from "./postRoutes.js";
import aiChatRoute from "./aiChatRoutes.js";

const router = express.Router();

// auth/register ... login
router.use("/auth", authRoute);

// verification email, get user, update user ...
router.use("/users", userRoute);

// create post, support post, comment post, ....
router.use("/posts", postRoute);

// create post, support post, comment post, ....
router.use("/aiChats", aiChatRoute);

export default router;
