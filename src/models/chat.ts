import { IMessage } from '../interfaces/IMessage';
import mongoose from 'mongoose';



const Chat = new mongoose.Schema(
  {
    name: {
      type: String,
      index: true,
    },
    message: {
      type: String,
      index: true,
    },
    date: {
      type: Date,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      ref: 'User',
    },
    
  },
  { timestamps: true },
);

export default mongoose.model<IMessage & mongoose.Document>('Chat', Chat);
