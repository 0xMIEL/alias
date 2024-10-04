import { Model } from 'mongoose';
import { AppError } from '../../core/AppError';
import { IChat, IMessage } from './types/chatTypes';

export default class ChatService {
  constructor(private Chat: Model<IChat>) {
    this.Chat = Chat;
  }

  async create(data: IChat) {
    const chat = new this.Chat(data);
    return await chat.save();
  }

  async getOne(gameRoomId: string) {
    const chat = await this.Chat.findOne({ gameRoomId });

    if (!chat) {
      throw new AppError(`Invalid game room id: ${gameRoomId}`);
    }

    return chat;
  }

  async createMessage(gameRoomId: string, data: IMessage) {
    const chat = await this.Chat.findOne({ gameRoomId });

    if (!chat) {
      throw new AppError(`Invalid game room id: ${gameRoomId}`);
    }

    chat.messages.push(data);

    return chat.save();
  }
}
