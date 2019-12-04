import { IUser } from '../interfaces/IUser';
import mongoose from 'mongoose';

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a full name'],
      index: true,
    },

    email: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },

    password: String,

    phone: {
      type: String,
      required: false
    },
    teamName: {
      type: String,
      required: false
    },
    mobileConfirm: {
      type: Boolean,
      required: false,
      default: false
    },
    lastLogin: {
      type: Date,
      required: false
    },
    role: {
      type: String,
      default: 'user',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true },
);

export default mongoose.model<IUser & mongoose.Document>('User', User);
