import mongoose, { Schema, model } from 'mongoose';
import type { IChat } from './types/chatTypes';

const chatSchema = new Schema<IChat>({
  gameRoomId: mongoose.Types.ObjectId,
  messages: [
    {
      content: String,
      timeStamp: String,
      userId: String,
      username: String,
    },
  ],
});

const ChatModel = model('Chat', chatSchema);

export default ChatModel;
