import express from "express";
import path from "path";
import {
  acceptRequest,
  changePassword,
  friendRequest,
  getFriendRequest,
  getUser,
  profileViews,
  requestPasswordReset,
  resetPassword,
  suggestedFriends,
  updateUser,
  verifyEmail,
} from "../controllers/userController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();
const __dirname = path.resolve(path.dirname(""));

// when the user click in the verification mail link
router.get("/verify/:userId/:token", verifyEmail);

// PASSWORD RESET
router.post("/request-passwordreset", requestPasswordReset);
router.get("/reset-password/:userId/:token", resetPassword);
router.post("/reset-password", changePassword);

// user routes
router.get("/get-user/:id?", userAuth, getUser);
router.put("/update-user", userAuth, updateUser);

// friend request
router.post("/friend-request", userAuth, friendRequest);
router.get("/get-friend-request", userAuth, getFriendRequest);

// accept / deny friend request
router.post("/accept-request", userAuth, acceptRequest);

// view profile
router.post("/profile-view", userAuth, profileViews);

//suggested friends
router.get("/suggested-friends", userAuth, suggestedFriends);

// redirect to the html page for the email ferification
router.get("/verified", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "verifiedpage.html"));
});

// redirect to the html page for the reset password
router.get("/resetpassword", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "resetpassword.html"));
});

export default router;
