const express = require("express");

const {
  getLoggedUser,
  getAllUsers,
  uploadProfilePic,
} = require("../controllers/userControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/get-logged-user", authMiddleware, getLoggedUser);

router.get("/get-all-users", authMiddleware, getAllUsers);

router.post("/upload-profile-pic", authMiddleware, uploadProfilePic);

module.exports = router;
