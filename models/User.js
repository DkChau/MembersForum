let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  admin: { type: Boolean, default: false },
  member: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
