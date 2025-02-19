const express = require("express");
const router = express.Router();
const { getUserInfo, updateUserInfo } = require("../controllers/userController");

// root route: /api/users
router.get("/:id", getUserInfo);
router.put("/:id", updateUserInfo);

module.exports = router;