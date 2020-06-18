const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema(
  {
    text: String,
    score: Number,
    user: Number,
  },
  { timestamps: true }
);

module.exports = Record = mongoose.model("records", RecordSchema);
