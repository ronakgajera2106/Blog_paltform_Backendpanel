require("dotenv").config();
// const { Router } = require("express");
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// const router = Router();

const { SECRET = "secret" } = process.env;

const signupController = async (req, res) => {
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({
      emailaddress: req.body.emailaddress,
    });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists with this email.",
      });
    }

    // Hash the password and create the new user
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const user = await User.create(req.body);

    res.status(201).json({
      message: "Your account has been registered!",
      user: user,
    });
  } catch (error) {
    res
      .status(400)
      .json({ error: error.message, message: "something went wrong !!" });
  }
};

const loginController = async (req, res) => {
  try {
    const { emailaddress, password } = req.body;
    // check if the user exists
    const user = await User.findOne({ emailaddress: emailaddress });
    if (user) {
      //check if password matches
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        // sign token and send it in response
        const token = await jwt.sign(
          { emailaddress: user.emailaddress },
          SECRET
        );
        user.authToken = token;
        await user.save();
        res.status(200).json({
          id: user._id,
          message: "Login Sucessfull",
          data: {
            firstname: user.firstname,
            lastname: user.lastname,
            emailaddress: user.emailaddress,
            phnnumber: user.phnnumber,
            token: token,
          },
        });
      } else {
        res.status(400).json({ error: "password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "User doesn't exist" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

const logOutController = async (req, res) => {
  // In a stateless JWT approach, just return a successful response
  // console.log("test=>>", req.user);
  console.log(
    "test",
    await User.updateMany(
      { emailaddress: req.user.emailaddress },
      { $set: { authToken: null } }
    )
  );
  res.json({ message: "Logged out successfully" });
};

// router.post("/login", loginController);

module.exports = { signupController, loginController, logOutController };
