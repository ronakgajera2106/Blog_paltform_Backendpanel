const { Router } = require("express");
const {
  loginController,
  signupController,
  logOutController,
} = require("../../controllers/User");
const { createContext, isLoggedIn } = require("../../controllers/middleware");
const router = Router();

router.post("/signup", createContext, signupController);

router.post("/login", createContext, loginController);

router.post("/logout", isLoggedIn, logOutController);

module.exports = router;
