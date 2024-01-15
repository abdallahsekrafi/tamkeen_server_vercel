import mongoose, { Schema } from "mongoose";

//schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is Required!"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is Required!"],
    },
    email: {
      type: String,
      required: [true, " Email is Required!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required!"],
      minlength: [6, "Password length should be greater than 6 character"],
      select: true,
    },
    coverUrl: { type: String },
    profileUrl: { type: String },
    isDisabled: { type: Boolean, default: false },
    isFMDisabled: { type: Boolean, default: false },
    isMental: { type: Boolean, default: false },
    isMotor: { type: Boolean, default: false },
    isHearing: { type: Boolean, default: false },
    isVisual: { type: Boolean, default: false },
    isPsychological: { type: Boolean, default: false },
    friends: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    views: [{ type: String }],
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", userSchema);

export default Users;
