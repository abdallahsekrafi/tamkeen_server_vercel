import mongoose, { Schema } from "mongoose";

//schema
const postSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Users" },
    description: { type: String },
    image: { type: String },
    isAccessibility: { type: Boolean, default: false },
    isGivingHelp: { type: Boolean, default: true },
    isMental: { type: Boolean, default: true },
    isMotor: { type: Boolean, default: true },
    isHearing: { type: Boolean, default: true },
    isVisual: { type: Boolean, default: true },
    isPsychological: { type: Boolean, default: true },
    supports: [{ type: String }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comments" }],
  },
  { timestamps: true }
);

const Posts = mongoose.model("Posts", postSchema);

export default Posts;
