import mongoose, { Schema, model } from 'mongoose';
import type { IChat } from './types/chatTypes';

const chatSchema = new Schema<IChat>({
  gameRoomId: {
    required: true,
    type: String,
  },
  messages: [
    {
      content: {
        required: true,
        type: String,
      },
      sendAt: {
        default: Date.now,
        type: Date,
      },
      userId: {
        required: true,
        type: mongoose.Types.ObjectId,
      },
      username: {
        required: true,
        type: String,
      },
    },
  ],
});

const Chat = model<IChat>('Chat', chatSchema);

export default Chat;
