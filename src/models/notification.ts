import { Schema, model, Types } from "mongoose";

const schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  seen: {
    type: Boolean,
    default: false,
  },
  sendAt: {
    type: Date,
    default: new Date(),
  },
  sendBy: {
    type: Types.ObjectId,
    default: null,
  },
  sendTo: [
    {
      user: {
        type: Types.ObjectId,
        required: true,
      },
    },
  ],
});

const Notification = model("Notification", schema);

export default Notification;
