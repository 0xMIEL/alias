import { ObjectId } from 'mongoose';

export interface IChat {
  gameRoomId: ObjectId;
  messages: Array<{
    userId: ObjectId;
    username: string;
    content: string;
    sendAt: Date;
  }>;
}
