import { Document, Schema, model } from "mongoose";
import bcrypt from "bcrypt";

interface User extends Document {
  name: string;
  password: string;
  expoToken?: string;
  authTokens?: { token: string }[];
}

const schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 50,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  expoToken: {
    type: String,
    default: "",
  },
  authTokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

schema.methods.toJSON = function () {
  let user = this as User;
  user = user.toObject();

  delete user._id;
  delete user.__v;
  delete user.password;
  delete user.authTokens;

  return user;
};

schema.pre("save", async function () {
  const user = this as User;
  user.password = user.isModified("password")
    ? await bcrypt.hash(user.password, parseInt(process.env.SALT_ROUNDS))
    : user.password;

  return user;
});

export { User };
export default model<User>("User", schema);
