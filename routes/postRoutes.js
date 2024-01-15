import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import {
  commentPost,
  createPost,
  deletePost,
  getComments,
  getPost,
  getSearchPosts,
  getTamkeens,
  getUserPost,
  replyPostComment,
  supportPost,
  supportPostComment,
} from "../controllers/postController.js";

const router = express.Router();

// crete post
router.post("/create-post", userAuth, createPost);

// get all posts
router.get("/", userAuth, getTamkeens);
// get post by id
router.get("/:id", userAuth, getPost);
// get post by search
router.get("/search", userAuth, getSearchPosts);
// get user post
router.get("/get-user-post/:id", userAuth, getUserPost);

// get comments for a particular post
router.get("/comments/:postId", getComments);

//support a posts
router.post("/support/:id", userAuth, supportPost);
//support a comment/relply
router.post("/support-comment/:id/:rid?", userAuth, supportPostComment);

//comment a posts
router.post("/comment/:id", userAuth, commentPost);
//reply comment
router.post("/reply-comment/:id", userAuth, replyPostComment);

//delete post
router.delete("/:id", userAuth, deletePost);

export default router;
