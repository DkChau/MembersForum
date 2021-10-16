let mongoose = require("mongoose");
const { DateTime } = require("luxon");

let Schema = mongoose.Schema;

let messageSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

messageSchema.virtual("dateAdded").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});
module.exports = mongoose.model("message", messageSchema);
