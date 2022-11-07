import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  avatar: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["MANAGER", "USER"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.comparePassword = async function (password: string) {
  const user = this as UserDocument;

  return bcrypt.compare(password, user.password).catch((e) => false);
};

userSchema.pre("save", async function (next) {
  const user = this as UserDocument;
  if (!user.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hashSync(user.password, salt);
  user.password = hashed;
  user.avatar = `https://avatars.dicebear.com/api/avataaars/${Math.random()
    .toString(36)
    .substr(2, 5)}.svg`;
  return next();
});

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
