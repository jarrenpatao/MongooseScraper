const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let articleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

let article = mongoose.model("article", articleSchema);

module.exports = article;