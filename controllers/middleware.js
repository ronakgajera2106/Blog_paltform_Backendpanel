require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const createContext = async (req, res, next) => {
  req.context = {
    models: {
      User,
    },
  };
  next();
};

const isLoggedIn = async (req, res, next) => {
  console.log(req.headers.authorization, "tokennnnnnn");
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.replace("Bearer ", "");
      console.log(token, ">>>>token");
      if (token) {
        const payload = await jwt.verify(token, process.env.SECRET);
        if (payload) {
          req.user = payload;
        }
        if (token) {
          const user = await User.findOne({ authToken: token });
          console.log(user, "USERMALYO");
          if (!user) {
            return res.status(400).json({ error: "Invalide Token" });
          }
          req.user_id = user._id;
          next();
        } else {
          return res.status(400).json({ error: "token verification failed" });
        }
      } else {
        return res.status(400).json({ error: "malformed auth header" });
      }
    } else {
      return res.status(400).json({ error: "No authorization header" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

module.exports = {
  isLoggedIn,
  createContext,
};
