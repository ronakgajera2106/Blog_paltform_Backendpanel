const { Schema, model } = require("../db/connection");

const UserSchema = new Schema({
  firstname: { type: String, max: 25, required: "Your firstname is required" },
  lastname: { type: String, max: 25, required: "Your lastname is required" },
  phnnumber: { type: Number, required: "Your phnnumber is required" },
  emailaddress: {
    type: String,
    unique: true,
    lowercase: true,
    required: "Your email is required",
  },
  password: { type: String, max: 8, required: "Your password is required" },
  authToken: { type: String },
  checked: { type: Boolean },
});

const User = model("Users", UserSchema);

module.exports = User;
