import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import {
  createAiChats,
  deleteAiChat,
  deleteAllAiChats,
  getAiChats,
} from "../controllers/aiChatController.js";

const router = express.Router();

// get all AI chats
router.get("/", userAuth, getAiChats);

// create new aiChats
router.post("/new", userAuth, createAiChats);

// delete one aiChats
router.delete("/delete/:id", userAuth, deleteAiChat);

// delete one aiChats
router.delete("/deleteAll", userAuth, deleteAllAiChats);
export default router;
