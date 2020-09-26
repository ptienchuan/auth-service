import { Schema, model } from "mongoose";

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

const User = model("User", schema);

export default User;
