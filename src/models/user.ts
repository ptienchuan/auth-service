import { Document, Schema, model } from "mongoose";

interface IUser extends Document {
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

export { IUser };
export default model<IUser>("User", schema);
