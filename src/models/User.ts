import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: false, default: "" }, // Optional for social logins
  },
  { timestamps: true }
);

// ⚠️ This is the correct fix:
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
