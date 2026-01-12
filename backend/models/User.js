import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
      index: true
    },
    passwordHash: {
      type: String,
      required: true,
      minlength: 60   // bcrypt hashes are always ~60 chars
    }
  },
  {
    timestamps: true
  }
);

// Ensure unique email at DB level
userSchema.index({ email: 1 }, { unique: true });

export default mongoose.model("User", userSchema);