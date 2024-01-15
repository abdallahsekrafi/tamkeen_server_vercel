import mongoose, { Schema } from "mongoose";

//schema
const aiChatSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Users" },
    content: { type: String },
    role: { type: String },
  },
  { timestamps: true }
);

const AiChats = mongoose.model("AiChats", aiChatSchema);

export default AiChats;
