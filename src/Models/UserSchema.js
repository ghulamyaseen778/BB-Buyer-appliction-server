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
      trim: true,
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
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const otpVerificationSchema = mongoose.Schema(
  {
    UserId: {
      type: String,
      required: true,
    },
    otp:{
      type:String,
      required:true
    },
    expireAt: {
      type: Date,
      default: Date.now() + 3600000*+1,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
const otpVerification = mongoose.model("otpVerification", otpVerificationSchema);
export {User,otpVerification};
