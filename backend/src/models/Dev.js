const { Schema, model } = require("mongoose");

const DevSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    user: {
      type: String,
      required: true
    },
    bio: String,
    avatar: {
      type: String,
      required: true
    },
    comments: [
      {
        comment: String,
        likes: Number,
        dislikes: Number,
        ranking: Number
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = model("Dev", DevSchema);
