import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      trim:true
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
export default User;
